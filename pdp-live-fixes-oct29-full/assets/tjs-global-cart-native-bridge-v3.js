(() => {
  'use strict';

  const STATE_KEY = '__TJS_GLOBAL_CART_STATE_V3__';
  const state = window[STATE_KEY] = window[STATE_KEY] || {};

  const detachController = controller => {
    if (!controller) return;

    const listeners = [
      [document, 'click', 'onClick', true],
      [document, 'submit', 'onSubmit', true],
      [document, 'keydown', 'onKeydown', false],
      [document, 'cart:update', 'onThemeCartUpdate', true],
      [document, 'cart:reload', 'onThemeCartReload', true],
      [document, 'cart:updated', 'onExternalCartEvent', false],
      [document, 'cart:change', 'onExternalCartEvent', false],
      [document, 'variant:add', 'onExternalCartEvent', true],
      [document, 'product:added', 'onExternalCartEvent', true],
      [document, 'ajaxCart:updated', 'onExternalCartEvent', true],
      [document, 'cart:count:update', 'onCartCountUpdate', false],
      [document, 'shopify:section:load', 'onSectionLoad', false],
      [document, 'shopify:section:unload', 'onSectionUnload', false],
      [window, 'pageshow', 'onPageShow', false]
    ];

    listeners.forEach(([target, eventName, handlerName, capture]) => {
      const handler = controller[handlerName];
      if (typeof handler !== 'function') return;
      try {
        target.removeEventListener(eventName, handler, capture);
      } catch (error) {}
    });

    try {
      controller.rootObserver?.disconnect?.();
    } catch (error) {}
  };

  const previousControllers = new Set([
    window.__TJS_CART_CONTROLLER_INSTANCE__,
    window.__TJS_GLOBAL_CART_STATE__?.controller,
    state.controller
  ]);

  previousControllers.forEach(controller => {
    if (controller?.__tjsNativeBridgeVersion !== 3) {
      detachController(controller);
    }
  });

  if (state.controller?.__tjsNativeBridgeVersion === 3) {
    state.controller.init?.();
    return;
  }

  const ROOT_SELECTOR = '[data-tjs-side-cart-root]';
  const ADD_FORM_SELECTOR = 'form[action*="/cart/add"]';
  const ADD_SUBMIT_SELECTOR = [
    'form[action*="/cart/add"] button[type="submit"]',
    'form[action*="/cart/add"] input[type="submit"]',
    'form[action*="/cart/add"] [name="add"]'
  ].join(',');
  const NATIVE_THEME_FORM_SELECTOR = [
    'wrapp-hdt-pr-frm form',
    'wrapp-hdt-pr-frm-bundle form'
  ].join(',');
  const CART_MUTATION_RE =
    /\/cart\/(add|change|update|clear)(?:\.js)?\/?$/i;
  const OPEN_SELECTOR = [
    '[data-tjs-cart-open]',
    '[aria-controls="CartDrawer"]'
  ].join(',');
  const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  class TJSGlobalCartController {
    constructor() {
      this.root = null;
      this.panel = null;
      this.sectionId = '';
      this.queue = Promise.resolve();
      this.lastTrigger = null;
      this.previousOverflow = '';
      this.refreshTimer = null;
      this.initialized = false;
      this.listenersBound = false;
      this.publicApiInstalled = false;
      this.rootObserver = null;
      this.rootWaiters = [];
      this.rootGeneration = 0;
      this.externalSyncTimer = null;
      this.pendingExternalOpen = false;
      this.pendingExternalReason = '';
      this.internalMutationDepth = 0;
      this.formNormaliseTimer = null;

      this.onClick = this.onClick.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.onKeydown = this.onKeydown.bind(this);
      this.onThemeCartUpdate = this.onThemeCartUpdate.bind(this);
      this.onThemeCartReload = this.onThemeCartReload.bind(this);
      this.onExternalCartEvent = this.onExternalCartEvent.bind(this);
      this.onCartCountUpdate = this.onCartCountUpdate.bind(this);
      this.onSectionLoad = this.onSectionLoad.bind(this);
      this.onSectionUnload = this.onSectionUnload.bind(this);
      this.onPageShow = this.onPageShow.bind(this);
    }

    init() {
      this.installPublicApi();
      this.bindGlobalListeners();
      this.installFetchBridge();
      this.suppressLegacyCartBehaviour();
      this.normaliseNativeCartForms(document);

      if (!this.connectRoot()) {
        this.watchForRoot();
      }

      return this;
    }

    installPublicApi() {
      if (this.publicApiInstalled) return;
      this.publicApiInstalled = true;

      window.TJSCart = {
        add: options => this.add(options || {}),
        addForm: form => this.addForm(form),
        change: (key, quantity) => this.change(key, quantity),
        remove: key => this.change(key, 0),
        open: () => this.openFresh(),
        close: () => this.close(),
        refresh: () => this.refresh({ preserveOpen: true }),
        getCart: () => this.fetchCart(),
        reconnect: () => this.connectRoot()
      };

      this.installShopifyActions();
    }

    bindGlobalListeners() {
      if (this.listenersBound) return;
      this.listenersBound = true;

      document.addEventListener('click', this.onClick, true);
      document.addEventListener('submit', this.onSubmit, true);
      document.addEventListener('keydown', this.onKeydown);

      /*
        Ecomus/HDT uses cart:update, not cart:updated. Capture phase lets
        this bridge neutralise the legacy drawer action before the native
        cart-drawer listener receives the same event in bubble phase.
      */
      document.addEventListener(
        'cart:update',
        this.onThemeCartUpdate,
        true
      );
      document.addEventListener(
        'cart:reload',
        this.onThemeCartReload,
        true
      );
      document.addEventListener(
        'cart:updated',
        this.onExternalCartEvent
      );
      document.addEventListener(
        'cart:change',
        this.onExternalCartEvent
      );
      document.addEventListener(
        'variant:add',
        this.onExternalCartEvent,
        true
      );
      document.addEventListener(
        'product:added',
        this.onExternalCartEvent,
        true
      );
      document.addEventListener(
        'ajaxCart:updated',
        this.onExternalCartEvent,
        true
      );
      document.addEventListener(
        'cart:count:update',
        this.onCartCountUpdate
      );
      document.addEventListener(
        'shopify:section:load',
        this.onSectionLoad
      );
      document.addEventListener(
        'shopify:section:unload',
        this.onSectionUnload
      );
      window.addEventListener('pageshow', this.onPageShow);
    }

    installFetchBridge() {
      if (state.fetchBridgeInstalled) return;

      const nativeFetch = window.fetch.bind(window);
      state.fetchBridgeInstalled = true;
      state.nativeFetch = nativeFetch;

      window.fetch = async (input, init) => {
        const mutation = this.cartMutationFromRequest(input, init);
        const internal = this.internalMutationDepth > 0;
        const response = await nativeFetch(input, init);

        if (mutation && !internal && response.ok) {
          queueMicrotask(() => {
            this.scheduleExternalSync({
              open: mutation === 'add',
              reason: `fetch:${mutation}`
            });
          });
        }

        return response;
      };
    }

    cartMutationFromRequest(input, init = {}) {
      try {
        const rawUrl =
          typeof input === 'string'
            ? input
            : input instanceof URL
              ? input.toString()
              : input?.url || '';
        const method = String(
          init?.method || input?.method || 'GET'
        ).toUpperCase();

        if (method === 'GET' || !rawUrl) return '';

        const url = new URL(rawUrl, window.location.origin);
        if (url.origin !== window.location.origin) return '';

        const match = url.pathname.match(CART_MUTATION_RE);
        return match?.[1]?.toLowerCase() || '';
      } catch (error) {
        return '';
      }
    }

    async withInternalMutation(task) {
      this.internalMutationDepth += 1;

      try {
        return await task();
      } finally {
        this.internalMutationDepth = Math.max(
          0,
          this.internalMutationDepth - 1
        );
      }
    }

    suppressLegacyCartBehaviour() {
      if (window.themeHDN?.settings) {
        if (!Object.prototype.hasOwnProperty.call(
          state,
          'previousActionAfterATC'
        )) {
          state.previousActionAfterATC =
            window.themeHDN.settings.actionAfterATC;
        }

        window.themeHDN.settings.actionAfterATC = 'no_action';
      }

      this.normaliseNativeCartForms(document);
      this.closeLegacyDrawer();
    }

    normaliseNativeCartForms(scope = document) {
      const root =
        scope instanceof Element || scope instanceof Document
          ? scope
          : document;

      root.querySelectorAll(
        'form[action*="/cart/add"] input[name="action_added"]'
      ).forEach(input => {
        if (input.closest('[data-tjs-preserve-action-after-atc]')) {
          return;
        }

        input.value = 'no_action';
        input.setAttribute('value', 'no_action');
      });
    }

    scheduleExternalSync({ open = false, reason = 'external' } = {}) {
      const autoOpen = this.root?.dataset.autoOpen !== 'false';

      this.pendingExternalOpen =
        this.pendingExternalOpen || (open && autoOpen);
      this.pendingExternalReason = reason;

      window.clearTimeout(this.externalSyncTimer);
      this.externalSyncTimer = window.setTimeout(() => {
        const shouldOpen = this.pendingExternalOpen;
        const syncReason = this.pendingExternalReason;

        this.pendingExternalOpen = false;
        this.pendingExternalReason = '';

        this.enqueue(() =>
          this.syncExternalMutation({
            open: shouldOpen,
            reason: syncReason
          })
        );
      }, 80);
    }

    async syncExternalMutation({ open = false } = {}) {
      const root = await this.ensureRoot(4000);

      this.closeLegacyDrawer();

      if (!root) {
        this.updateCartCountFromServer();
        return null;
      }

      if (open) {
        this.open({ focus: false });
      }

      const cart = await this.refresh({
        preserveOpen: open || this.isOpen()
      });

      if (open && this.root) {
        this.open({ focus: true });
      }

      return cart;
    }

    async updateCartCountFromServer() {
      try {
        const cart = await this.fetchCart();
        this.updateCartCount(cart?.item_count ?? 0);
        return cart;
      } catch (error) {
        return null;
      }
    }

    onSectionLoad(event) {
      this.normaliseNativeCartForms(event?.target || document);
      this.suppressLegacyCartBehaviour();

      if (!this.connectRoot()) this.watchForRoot();
    }

    onSectionUnload() {
      if (!document.querySelector(ROOT_SELECTOR)) {
        this.root = null;
        this.panel = null;
        this.sectionId = '';

        document.documentElement.classList.remove(
          'tjs-global-cart-ready'
        );
        document.documentElement.classList.remove(
          'tjs-global-cart-disable-legacy'
        );

        this.watchForRoot();
      }
    }

    onPageShow(event) {
      if (!this.connectRoot()) {
        this.watchForRoot();
        return;
      }

      if (event.persisted) {
        this.refresh({ preserveOpen: false });
      }
    }

    connectRoot() {
      const nextRoot = document.querySelector(ROOT_SELECTOR);

      if (!nextRoot) {
        this.root = null;
        this.panel = null;
        this.sectionId = '';

        document.documentElement.classList.remove(
          'tjs-global-cart-ready'
        );
        document.documentElement.classList.remove(
          'tjs-global-cart-disable-legacy'
        );

        return false;
      }

      const changed = this.root !== nextRoot;

      this.root = nextRoot;
      this.panel =
        nextRoot.querySelector('[data-tjs-cart-panel]');
      this.sectionId =
        nextRoot.dataset.sectionId || '';

      nextRoot.dataset.controllerReady = 'true';
      document.documentElement.classList.add(
        'tjs-global-cart-ready'
      );
      this.suppressLegacyCartBehaviour();

      if (nextRoot.dataset.disableOldDrawer === 'true') {
        document.documentElement.classList.add(
          'tjs-global-cart-disable-legacy'
        );
      } else {
        document.documentElement.classList.remove(
          'tjs-global-cart-disable-legacy'
        );
      }

      if (changed) {
        this.rootGeneration += 1;
        this.updateCountFromRoot();
        this.setupReservationTimer();
        this.resolveRootWaiters(nextRoot);
      }

      if (this.rootObserver) {
        this.rootObserver.disconnect();
        this.rootObserver = null;
      }

      return true;
    }

    syncRoot() {
      return this.connectRoot();
    }

    watchForRoot() {
      if (this.rootObserver || this.root) return;

      this.rootObserver = new MutationObserver(mutations => {
        this.connectRoot();

        window.clearTimeout(this.formNormaliseTimer);
        this.formNormaliseTimer = window.setTimeout(() => {
          mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
              if (node instanceof Element) {
                this.normaliseNativeCartForms(node);
              }
            });
          });
        }, 0);
      });

      this.rootObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }

    ensureRoot(timeout = 6000) {
      if (this.connectRoot()) {
        return Promise.resolve(this.root);
      }

      this.watchForRoot();

      return new Promise(resolve => {
        let settled = false;

        const finish = root => {
          if (settled) return;
          settled = true;
          resolve(root || null);
        };

        this.rootWaiters.push(finish);

        window.setTimeout(() => {
          finish(
            this.connectRoot()
              ? this.root
              : null
          );
        }, timeout);
      });
    }

    resolveRootWaiters(root) {
      const waiters = this.rootWaiters.splice(0);
      waiters.forEach(resolve => resolve(root));
    }

    installShopifyActions() {
      window.Shopify = window.Shopify || {};
      window.Shopify.actions = window.Shopify.actions || {};

      if (
        !Object.prototype.hasOwnProperty.call(
          window.Shopify.actions,
          '__tjsPreviousOpenCart'
        )
      ) {
        window.Shopify.actions.__tjsPreviousOpenCart =
          window.Shopify.actions.openCart;
        window.Shopify.actions.__tjsPreviousGetCart =
          window.Shopify.actions.getCart;
        window.Shopify.actions.__tjsPreviousUpdateCart =
          window.Shopify.actions.updateCart;
      }

      window.Shopify.actions.openCart =
        () => this.openFresh();

      window.Shopify.actions.getCart =
        () => this.fetchCart();

      window.Shopify.actions.updateCart = payload => {
        const updates = payload?.updates || payload || {};
        return this.update(updates);
      };
    }

    onClick(event) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const closeTrigger = target.closest('[data-tjs-cart-close]');
      if (closeTrigger && this.root?.contains(closeTrigger)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.close();
        return;
      }

      const checkoutTrigger = target.closest(
        '.tjs-side-cart__checkout-wrap button, ' +
        '.tjs-side-cart__checkout-wrap a, ' +
        '.tjs-side-cart__checkout'
      );

      if (checkoutTrigger && this.root?.contains(checkoutTrigger)) {
        this.close();
        this.closeLegacyDrawer();
      }

      const openTrigger = target.closest(OPEN_SELECTOR);
      if (openTrigger && !this.root?.contains(openTrigger)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.lastTrigger = openTrigger;

        this.openFresh({
          trigger: openTrigger
        }).catch(error => {
          console.error(
            '[TJS Cart] Open failed:',
            error
          );
        });

        return;
      }

      const lineChange = target.closest('[data-tjs-line-change]');
      if (lineChange && this.root?.contains(lineChange)) {
        event.preventDefault();
        event.stopImmediatePropagation();

        const key = lineChange.dataset.key || '';
        const quantity = Math.max(0, Number(lineChange.dataset.quantity || 0));

        if (key) {
          this.enqueue(() => this.change(key, quantity, lineChange));
        }
        return;
      }

      const lineRemove = target.closest('[data-tjs-line-remove]');
      if (lineRemove && this.root?.contains(lineRemove)) {
        event.preventDefault();
        event.stopImmediatePropagation();

        const key = lineRemove.dataset.key || '';
        if (key) {
          this.enqueue(() => this.change(key, 0, lineRemove));
        }
        return;
      }

      /*
        Intercept clicks on every conventional Shopify product-form submit
        button before legacy per-section handlers can add a duplicate line.
      */
      const addSubmit = target.closest(ADD_SUBMIT_SELECTOR);
      if (addSubmit) {
        const form = addSubmit.closest(ADD_FORM_SELECTOR);

        if (form && this.shouldOwnAddForm(form)) {
          event.preventDefault();
          event.stopImmediatePropagation();
          this.enqueue(() => this.addForm(form, addSubmit));
          return;
        }
      }

      const directAdd = target.closest(
        '[data-tjs-add-to-cart], [data-add-to-cart][data-variant-id]'
      );

      if (directAdd && !directAdd.closest(ADD_FORM_SELECTOR)) {
        const variantId =
          directAdd.dataset.variantId ||
          directAdd.dataset.productVariantId ||
          directAdd.getAttribute('data-id') ||
          '';

        if (!variantId) return;

        event.preventDefault();
        event.stopImmediatePropagation();

        const quantity = Math.max(1, Number(directAdd.dataset.quantity || 1));
        let properties = {};

        try {
          properties = directAdd.dataset.properties
            ? JSON.parse(directAdd.dataset.properties)
            : {};
        } catch (error) {
          properties = {};
        }

        this.enqueue(() =>
          this.add({
            variantId,
            quantity,
            properties,
            sellingPlanId: directAdd.dataset.sellingPlan || '',
            trigger: directAdd
          })
        );
      }
    }

    onSubmit(event) {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      if (!this.shouldOwnAddForm(form)) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      this.enqueue(() => this.addForm(form, event.submitter || null));
    }

    onKeydown(event) {
      if (!this.isOpen()) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        this.close();
        return;
      }

      if (event.key !== 'Tab' || !this.panel) return;

      const focusable = [...this.panel.querySelectorAll(FOCUSABLE_SELECTOR)]
        .filter(node => !node.hidden && node.offsetParent !== null);

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    onThemeCartUpdate(event) {
      const detail = event.detail || {};

      if (detail.source === 'tjs-global-cart') return;

      const originalAction = String(
        detail.actionAfterATC || ''
      );
      const source = String(detail.source || '');
      const isAdd =
        source === 'product-form-component' ||
        source.includes('add') ||
        Boolean(detail?.data?.variantId) ||
        originalAction === 'open_cart_drawer';

      /* Prevent the native hidden drawer from opening in bubble phase. */
      detail.actionAfterATC = 'no_action';
      this.closeLegacyDrawer();

      this.scheduleExternalSync({
        open: isAdd,
        reason: 'cart:update'
      });
    }

    onThemeCartReload() {
      this.scheduleExternalSync({
        open: false,
        reason: 'cart:reload'
      });
    }

    onExternalCartEvent(event) {
      if (event.detail?.source === 'tjs-global-cart') return;

      const addEvents = new Set([
        'variant:add',
        'product:added'
      ]);

      const source = String(event.detail?.source || '');
      const shouldOpen =
        addEvents.has(event.type) ||
        source === 'product-form-component' ||
        source.includes('add');

      this.scheduleExternalSync({
        open: shouldOpen,
        reason: event.type
      });
    }

    onCartCountUpdate(event) {
      const count = Number(event.detail?.item_count);
      if (Number.isFinite(count)) {
        this.updateCartCount(count);
      }
    }

    shouldOwnAddForm(form) {
      if (!this.isAddForm(form)) return false;
      if (form.hasAttribute('data-tjs-cart-bypass')) return false;
      if (form.closest('[data-tjs-use-native-cart]')) return false;
      if (form.matches(NATIVE_THEME_FORM_SELECTOR)) return false;
      if (form.closest('wrapp-hdt-pr-frm, wrapp-hdt-pr-frm-bundle')) {
        return false;
      }

      return true;
    }

    isAddForm(form) {
      if (form.hasAttribute('data-tjs-cart-form')) return true;

      try {
        const action = new URL(form.action || '', window.location.origin);
        return /\/cart\/add(?:\.js)?\/?$/.test(action.pathname);
      } catch (error) {
        return false;
      }
    }

    enqueue(task) {
      const run = this.queue.then(task, task);
      this.queue = run.catch(() => {});
      return run;
    }

    async addForm(form, trigger = null) {
      if (!(form instanceof HTMLFormElement)) {
        throw new Error('Product form was not found.');
      }

      const formData = new FormData(form);

      if (!this.formDataHasVariant(formData)) {
        this.showToast('Select an available option first.', 'error');
        return null;
      }

      return this.mutateAdd({
        body: formData,
        trigger,
        source: form.dataset.tjsCartSource || 'product-form'
      });
    }

    async add({
      variantId,
      quantity = 1,
      properties = {},
      sellingPlanId = '',
      trigger = null,
      source = 'direct-button'
    }) {
      if (!variantId) {
        this.showToast('Select an available option first.', 'error');
        return null;
      }

      const item = {
        id: Number(variantId),
        quantity: Math.max(1, Number(quantity || 1))
      };

      if (properties && Object.keys(properties).length) {
        item.properties = properties;
      }

      if (sellingPlanId) {
        item.selling_plan = Number(sellingPlanId);
      }

      await this.ensureRoot(5000);

      const body = {
        items: [item]
      };

      if (this.sectionId) {
        body.sections = this.sectionId;
        body.sections_url = this.sectionsUrl();
      }

      return this.mutateAdd({
        body,
        trigger,
        source
      });
    }

    async mutateAdd({ body, trigger = null, source = 'unknown' }) {
      await this.ensureRoot(5000);

      const autoOpen =
        this.root?.dataset.autoOpen !== 'false';
      const isFormData = body instanceof FormData;

      if (isFormData) {
        body.delete('sections');
        body.delete('sections_url');

        if (this.sectionId) {
          body.set('sections', this.sectionId);
          body.set(
            'sections_url',
            this.sectionsUrl()
          );
        }
      }

      this.setTriggerBusy(trigger, true, 'Adding…');
      this.setBusy(true);

      if (autoOpen && this.root) this.open({ focus: false });

      try {
        const response = await this.withInternalMutation(() =>
          fetch(this.route('cart/add.js'), {
            method: 'POST',
            headers: isFormData
              ? {
                  Accept: 'application/json',
                  'X-Requested-With': 'XMLHttpRequest'
                }
              : {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  'X-Requested-With': 'XMLHttpRequest'
                },
            body: isFormData ? body : JSON.stringify(body)
          })
        );

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(
            payload.description ||
            payload.message ||
            'Unable to add this product.'
          );
        }

        const cartPromise = this.fetchCart();

        const rendered =
          this.root && this.sectionId
            ? await this.renderFromMutation(
                payload.sections,
                { open: autoOpen }
              )
            : false;

        const cart = await cartPromise;

        this.updateCartCount(
          cart?.item_count ?? 0
        );
        this.dispatchUpdated(
          cart,
          payload,
          source
        );

        if (
          !rendered &&
          this.root &&
          this.sectionId
        ) {
          await this.refresh({
            preserveOpen: autoOpen,
            cart
          });
        }

        this.setTriggerBusy(trigger, false, 'Added ✓', 650);
        this.showToast('Added to your cart.', 'success');

        if (autoOpen) {
          if (this.root) {
            this.open({ focus: true });
          } else {
            this.openLegacyDrawer();
          }
        }

        return { cart, payload };
      } catch (error) {
        console.error('[TJS Cart] Add failed:', error);
        this.setTriggerBusy(trigger, false);
        this.showToast(error.message || 'Unable to add this product.', 'error');
        throw error;
      } finally {
        this.setBusy(false);
      }
    }

    async change(key, quantity, trigger = null) {
      await this.ensureRoot(5000);
      if (!this.root || !this.sectionId) return null;

      this.setTriggerBusy(trigger, true);
      this.setBusy(true);
      this.open({ focus: false });

      try {
        const response = await this.withInternalMutation(() =>
          fetch(this.route('cart/change.js'), {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
              id: key,
              quantity: Math.max(0, Number(quantity || 0)),
              sections: this.sectionId,
              sections_url: this.sectionsUrl()
            })
          })
        );

        const cart = await response.json();

        if (!response.ok) {
          throw new Error(
            cart.description ||
            cart.message ||
            'Unable to update the cart.'
          );
        }

        const rendered = await this.renderFromMutation(cart.sections, {
          open: true
        });

        this.updateCartCount(cart.item_count ?? 0);
        this.dispatchUpdated(cart, null, 'line-change');

        if (!rendered) {
          await this.refresh({ preserveOpen: true, cart });
        }

        return cart;
      } catch (error) {
        console.error('[TJS Cart] Change failed:', error);
        this.showToast(error.message || 'Unable to update the cart.', 'error');
        throw error;
      } finally {
        this.setTriggerBusy(trigger, false);
        this.setBusy(false);
      }
    }

    async update(updates) {
      await this.ensureRoot(5000);
      if (!this.root || !this.sectionId) return null;

      this.setBusy(true);

      try {
        const response = await this.withInternalMutation(() =>
          fetch(this.route('cart/update.js'), {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
              updates,
              sections: this.sectionId,
              sections_url: this.sectionsUrl()
            })
          })
        );

        const cart = await response.json();

        if (!response.ok) {
          throw new Error(cart.description || 'Unable to update the cart.');
        }

        await this.renderFromMutation(cart.sections, {
          open: this.isOpen()
        });

        this.updateCartCount(cart.item_count ?? 0);
        this.dispatchUpdated(cart, null, 'cart-update');

        return cart;
      } finally {
        this.setBusy(false);
      }
    }

    async refresh({ preserveOpen = true, cart = null } = {}) {
      await this.ensureRoot(5000);
      if (!this.root || !this.sectionId) return null;

      const shouldOpen = preserveOpen && this.isOpen();
      this.setBusy(true);

      try {
        const [html, resolvedCart] = await Promise.all([
          this.fetchSectionHtml(),
          cart ? Promise.resolve(cart) : this.fetchCart()
        ]);

        if (html) {
          this.replaceRoot(html, { open: shouldOpen });
        }

        this.updateCartCount(resolvedCart?.item_count ?? 0);
        return resolvedCart;
      } catch (error) {
        console.error('[TJS Cart] Refresh failed:', error);
        return null;
      } finally {
        this.setBusy(false);
      }
    }

    async renderFromMutation(sections, { open = false } = {}) {
      const html = sections?.[this.sectionId];

      if (html) {
        return this.replaceRoot(html, { open });
      }

      const fallbackHtml = await this.fetchSectionHtml();
      if (!fallbackHtml) return false;

      return this.replaceRoot(fallbackHtml, { open });
    }

    replaceRoot(html, { open = false } = {}) {
      const parsed = new DOMParser().parseFromString(html, 'text/html');
      const nextRoot = parsed.querySelector(ROOT_SELECTOR);

      if (!nextRoot) return false;

      const currentRoot = document.querySelector(ROOT_SELECTOR);
      if (!currentRoot) return false;

      nextRoot.dataset.hydrated = 'true';
      currentRoot.replaceWith(nextRoot);
      this.connectRoot();

      if (open) this.open({ focus: false });
      return true;
    }

    async fetchSectionHtml() {
      const url = new URL(window.location.href);
      url.searchParams.set('section_id', this.sectionId);

      const response = await fetch(url.toString(), {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        cache: 'no-store'
      });

      if (!response.ok) return '';
      return response.text();
    }

    async fetchCart() {
      const response = await fetch(this.route('cart.js'), {
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error('Unable to read the cart.');
      }

      return response.json();
    }

    formDataHasVariant(formData) {
      const directId = formData.get('id');
      if (directId && Number(directId) > 0) return true;

      return [...formData.entries()].some(([key, value]) =>
        /items\[\d+\]\[id\]/.test(key) && Number(value) > 0
      );
    }

    route(path) {
      const root = window.Shopify?.routes?.root || '/';
      return `${root}${path}`.replace(/([^:]\/)\/+/, '$1');
    }

    sectionsUrl() {
      return `${window.location.pathname}${window.location.search}`;
    }

    async openFresh({
      trigger = null,
      focus = true
    } = {}) {
      if (trigger) this.lastTrigger = trigger;

      const root = await this.ensureRoot(5000);

      if (!root) {
        this.openLegacyDrawer();
        return false;
      }

      /*
        Open immediately in loading state, then reconcile with freshly
        rendered Shopify cart HTML. First open cannot expose stale markup.
      */
      this.open({ focus: false });
      await this.refresh({
        preserveOpen: true
      });

      if (this.root) {
        this.root.dataset.hydrated = 'true';
      }

      if (focus) {
        requestAnimationFrame(() => {
          this.root
            ?.querySelector(
              '[data-tjs-cart-close]'
            )
            ?.focus({
              preventScroll: true
            });
        });
      }

      return true;
    }

    closeLegacyDrawer() {
      const component = document.querySelector('hdt-cart-drawer');
      const dialog =
        component?.dialog ||
        component?.querySelector?.('#CartDrawer') ||
        document.getElementById('CartDrawer');

      if (dialog?.open) {
        try {
          if (typeof component?.close === 'function') {
            Promise.resolve(component.close(true)).catch(() => {});
          } else if (typeof dialog.close === 'function') {
            dialog.close();
          }
        } catch (error) {
          try {
            dialog.removeAttribute('open');
          } catch (nestedError) {}
        }
      }
    }

    openLegacyDrawer() {
      document.documentElement.classList.remove(
        'tjs-global-cart-disable-legacy'
      );

      const dialog =
        document.getElementById('CartDrawer');

      const legacyDrawer =
        document.querySelector(
          'hdt-cart-drawer, ' +
          'cart-drawer#CartDrawer'
        );

      if (
        dialog &&
        typeof dialog.showModal === 'function' &&
        !dialog.open
      ) {
        try {
          dialog.showModal();
          return true;
        } catch (error) {}
      }

      if (legacyDrawer) {
        legacyDrawer.setAttribute('open', '');
        legacyDrawer.dataset.open = 'true';
        return true;
      }

      window.location.assign(
        this.route('cart')
      );

      return false;
    }

    open({ focus = true } = {}) {
      this.syncRoot();
      if (!this.root) return;

      this.root.dataset.open = 'true';
      this.root.setAttribute('aria-hidden', 'false');
      document.documentElement.classList.add('tjs-side-cart-open');

      if (!this.previousOverflow) {
        this.previousOverflow = document.documentElement.style.overflow;
      }
      document.documentElement.style.overflow = 'hidden';

      if (focus) {
        requestAnimationFrame(() => {
          this.root
            ?.querySelector('[data-tjs-cart-close]')
            ?.focus({ preventScroll: true });
        });
      }
    }

    close() {
      this.syncRoot();
      if (!this.root) return;

      this.root.dataset.open = 'false';
      this.root.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('tjs-side-cart-open');
      document.documentElement.style.overflow = this.previousOverflow || '';
      this.previousOverflow = '';

      this.lastTrigger?.focus?.({ preventScroll: true });
    }

    isOpen() {
      return document.querySelector(ROOT_SELECTOR)?.dataset.open === 'true';
    }

    setBusy(isBusy) {
      this.syncRoot();
      if (!this.root) return;

      this.root.dataset.loading = isBusy ? 'true' : 'false';
      this.root.setAttribute('aria-busy', isBusy ? 'true' : 'false');
    }

    setTriggerBusy(trigger, busy, temporaryLabel = '', delay = 0) {
      if (!(trigger instanceof Element)) return;

      const label = trigger.querySelector(
        '[data-tjs-add-label], [data-add-label], [data-tjs-custom-atc-text]'
      );

      if (!trigger.dataset.tjsOriginalLabel && label) {
        trigger.dataset.tjsOriginalLabel = label.textContent.trim();
      }

      if (busy) {
        trigger.classList.add('is-loading');
        trigger.setAttribute('aria-busy', 'true');
        if ('disabled' in trigger) trigger.disabled = true;
        if (temporaryLabel && label) label.textContent = temporaryLabel;
        return;
      }

      const restore = () => {
        trigger.classList.remove('is-loading');
        trigger.removeAttribute('aria-busy');
        if ('disabled' in trigger) trigger.disabled = false;

        if (label) {
          label.textContent =
            trigger.dataset.tjsOriginalLabel ||
            label.textContent;
        }
      };

      if (temporaryLabel && label) {
        label.textContent = temporaryLabel;
      }

      if (delay) {
        window.setTimeout(restore, delay);
      } else {
        restore();
      }
    }

    updateCountFromRoot() {
      const count = Number(this.root?.dataset.cartCount || 0);
      this.updateCartCount(count);
    }

    updateCartCount(count) {
      const value = Math.max(0, Number(count || 0));
      const selectors = [
        '[data-tjs-cart-count]',
        '[data-cart-count]',
        'hdt-cart-count',
        '.js-cart-count',
        '.t4s-count-box',
        '.header__cart-count',
        '.cart-count-bubble span:first-child',
        '.cart-count-bubble span[aria-hidden="true"]'
      ];

      document.querySelectorAll(selectors.join(',')).forEach(node => {
        node.textContent = String(value);
        node.hidden = false;
        node.removeAttribute('hidden');
        node.dataset.count = String(value);
      });
    }

    dispatchUpdated(cart, mutation, source) {
      const detail = {
        cart,
        mutation,
        source: 'tjs-global-cart',
        actionSource: source
      };

      document.dispatchEvent(
        new CustomEvent('tjs:cart:updated', {
          bubbles: true,
          detail
        })
      );

      document.dispatchEvent(
        new CustomEvent('cart:updated', {
          bubbles: true,
          detail
        })
      );

      document.dispatchEvent(
        new CustomEvent('cart:count:update', {
          detail: {
            item_count: Number(cart?.item_count || 0),
            source: 'tjs-global-cart'
          }
        })
      );

      window.dispatchEvent(
        new CustomEvent('cart:refresh', {
          detail
        })
      );
    }

    showToast(message, type = 'success') {
      this.syncRoot();
      const toast = this.root?.querySelector('[data-tjs-cart-toast]');
      if (!toast) return;

      toast.textContent = message;
      toast.dataset.type = type;
      toast.classList.add('is-visible');

      clearTimeout(toast._tjsTimer);
      toast._tjsTimer = window.setTimeout(() => {
        toast.classList.remove('is-visible');
      }, 2600);
    }

    setupReservationTimer() {
      this.syncRoot();
      const timer = this.root?.querySelector('[data-tjs-reservation-timer]');
      if (!timer) return;

      const minutes = Math.max(1, Number(timer.dataset.minutes || 10));
      const storageKey = 'tjs_cart_reservation_expires_at';
      let expiresAt = Number(sessionStorage.getItem(storageKey) || 0);

      if (!expiresAt || expiresAt <= Date.now()) {
        expiresAt = Date.now() + minutes * 60 * 1000;
        sessionStorage.setItem(storageKey, String(expiresAt));
      }

      clearInterval(window.__TJS_CART_RESERVATION_INTERVAL__);

      const tick = () => {
        const remaining = Math.max(0, expiresAt - Date.now());
        const totalSeconds = Math.ceil(remaining / 1000);
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;

        timer.textContent = `${mins}:${String(secs).padStart(2, '0')}`;

        if (remaining <= 0) {
          expiresAt = Date.now() + minutes * 60 * 1000;
          sessionStorage.setItem(storageKey, String(expiresAt));
        }
      };

      tick();
      window.__TJS_CART_RESERVATION_INTERVAL__ = window.setInterval(tick, 1000);
    }
  }

  const controller =
    new TJSGlobalCartController();

  controller.__tjsNativeBridgeVersion = 3;
  state.controller = controller;

  window.__TJS_GLOBAL_CART_CONTROLLER__ = true;
  window.__TJS_CART_CONTROLLER_INSTANCE__ = controller;

  /*
    The section places this classic script immediately after its root, so
    binding now registers cart:update capture before the later system drawer.
  */
  controller.init();

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      () => controller.init(),
      { once: true }
    );
  }
})();