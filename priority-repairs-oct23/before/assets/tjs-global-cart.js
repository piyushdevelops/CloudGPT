(() => {
  'use strict';

  if (window.__TJS_GLOBAL_CART_CONTROLLER__) return;
  window.__TJS_GLOBAL_CART_CONTROLLER__ = true;

  const ROOT_SELECTOR = '[data-tjs-side-cart-root]';
  const ADD_FORM_SELECTOR = 'form[action*="/cart/add"]';
  const ADD_SUBMIT_SELECTOR = [
    'form[action*="/cart/add"] button[type="submit"]',
    'form[action*="/cart/add"] input[type="submit"]',
    'form[action*="/cart/add"] [name="add"]'
  ].join(',');
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

      this.onClick = this.onClick.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.onKeydown = this.onKeydown.bind(this);
      this.onExternalCartEvent = this.onExternalCartEvent.bind(this);
    }

    init() {
      this.syncRoot();
      if (!this.root || this.initialized) return;

      this.initialized = true;
      document.documentElement.classList.add('tjs-global-cart-ready');

      /*
        Capture phase is intentional. It prevents legacy theme/cart scripts
        from submitting the same product a second time or opening stale
        drawer HTML before the new global controller has reconciled it.
      */
      document.addEventListener('click', this.onClick, true);
      document.addEventListener('submit', this.onSubmit, true);
      document.addEventListener('keydown', this.onKeydown);

      document.addEventListener('cart:updated', this.onExternalCartEvent);
      document.addEventListener('cart:change', this.onExternalCartEvent);
      document.addEventListener('shopify:section:load', () => {
        this.syncRoot();
      });

      window.addEventListener('pageshow', event => {
        if (event.persisted) this.refresh({ preserveOpen: false });
      });

      window.TJSCart = {
        add: options => this.add(options || {}),
        addForm: form => this.addForm(form),
        change: (key, quantity) => this.change(key, quantity),
        remove: key => this.change(key, 0),
        open: () => this.open(),
        close: () => this.close(),
        refresh: () => this.refresh({ preserveOpen: true }),
        getCart: () => this.fetchCart()
      };

      this.installShopifyActions();
      this.updateCountFromRoot();
      this.setupReservationTimer();
    }

    syncRoot() {
      this.root = document.querySelector(ROOT_SELECTOR);
      this.panel = this.root?.querySelector('[data-tjs-cart-panel]') || null;
      this.sectionId = this.root?.dataset.sectionId || '';

      if (this.root?.dataset.disableOldDrawer === 'true') {
        document.documentElement.classList.add('tjs-global-cart-disable-legacy');
      }
    }

    installShopifyActions() {
      window.Shopify = window.Shopify || {};
      window.Shopify.actions = window.Shopify.actions || {};

      if (typeof window.Shopify.actions.openCart !== 'function') {
        window.Shopify.actions.openCart = () => this.open();
      }

      if (typeof window.Shopify.actions.getCart !== 'function') {
        window.Shopify.actions.getCart = () => this.fetchCart();
      }

      if (typeof window.Shopify.actions.updateCart !== 'function') {
        window.Shopify.actions.updateCart = payload => {
          const updates = payload?.updates || payload || {};
          return this.update(updates);
        };
      }
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

      const openTrigger = target.closest(OPEN_SELECTOR);
      if (openTrigger && !this.root?.contains(openTrigger)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.lastTrigger = openTrigger;
        this.open();
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
        if (form && !form.hasAttribute('data-tjs-cart-bypass')) {
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
      if (!this.isAddForm(form)) return;
      if (form.hasAttribute('data-tjs-cart-bypass')) return;

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

    onExternalCartEvent(event) {
      if (event.detail?.source === 'tjs-global-cart') return;

      clearTimeout(this.refreshTimer);
      this.refreshTimer = window.setTimeout(() => {
        this.refresh({ preserveOpen: this.isOpen() });
      }, 90);
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

      const body = {
        items: [item],
        sections: this.sectionId,
        sections_url: this.sectionsUrl()
      };

      return this.mutateAdd({ body, trigger, source });
    }

    async mutateAdd({ body, trigger = null, source = 'unknown' }) {
      this.syncRoot();

      if (!this.root || !this.sectionId) {
        throw new Error('The TJS side cart section is not installed globally.');
      }

      const autoOpen = this.root.dataset.autoOpen !== 'false';
      const isFormData = body instanceof FormData;

      if (isFormData) {
        body.delete('sections');
        body.delete('sections_url');
        body.set('sections', this.sectionId);
        body.set('sections_url', this.sectionsUrl());
      }

      this.setTriggerBusy(trigger, true, 'Adding…');
      this.setBusy(true);

      if (autoOpen) this.open({ focus: false });

      try {
        const response = await fetch(this.route('cart/add.js'), {
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
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(
            payload.description ||
            payload.message ||
            'Unable to add this product.'
          );
        }

        const cartPromise = this.fetchCart();
        const rendered = await this.renderFromMutation(payload.sections, {
          open: autoOpen
        });
        const cart = await cartPromise;

        this.updateCartCount(cart?.item_count ?? 0);
        this.dispatchUpdated(cart, payload, source);

        if (!rendered) {
          await this.refresh({ preserveOpen: autoOpen, cart });
        }

        this.setTriggerBusy(trigger, false, 'Added ✓', 650);
        this.showToast('Added to your cart.', 'success');

        if (autoOpen) this.open({ focus: true });

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
      this.syncRoot();
      if (!this.root || !this.sectionId) return null;

      this.setTriggerBusy(trigger, true);
      this.setBusy(true);
      this.open({ focus: false });

      try {
        const response = await fetch(this.route('cart/change.js'), {
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
        });

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
      this.syncRoot();
      if (!this.root || !this.sectionId) return null;

      this.setBusy(true);

      try {
        const response = await fetch(this.route('cart/update.js'), {
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
        });

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
      this.syncRoot();
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

      currentRoot.replaceWith(nextRoot);
      this.syncRoot();
      this.setupReservationTimer();

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

  const boot = () => {
    const controller = new TJSGlobalCartController();
    controller.init();
    window.__TJS_CART_CONTROLLER_INSTANCE__ = controller;
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
