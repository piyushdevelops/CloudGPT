(() => {
  if (customElements.get('june-page-cart')) return;
  class JunePageCart extends HTMLElement {
    connectedCallback() {
      this.abort = new AbortController();
      this.addEventListener('click', event => {
        const button = event.target.closest('button');
        if (!button) return;
        const row = button.closest('[data-line-key]');
        if (!row) return;
        const input = row.querySelector('[name="updates[]"]');
        if (!button.matches('[data-page-cart-remove], [name="minus"], [name="plus"]')) return;
        event.preventDefault(); event.stopImmediatePropagation();
        if (this.busy) return;
        let quantity = 0;
        if (!button.hasAttribute('data-page-cart-remove')) {
          quantity = Number(input.value) + (button.name === 'plus' ? 1 : -1) * Number(input.step || 1);
          if (quantity < Number(input.min || 1) || quantity > Number(input.max || Infinity)) return;
        }
        this.change(row, quantity, button);
      }, {capture:true, signal:this.abort.signal});
      this.addEventListener('change', event => {
        const input = event.target.closest('[name="updates[]"]');
        if (!input) return;
        event.stopImmediatePropagation();
        if (this.busy || !input.checkValidity()) { input.value = input.defaultValue; return; }
        this.change(input.closest('[data-line-key]'), Number(input.value), input);
      }, {capture:true, signal:this.abort.signal});
    }
    disconnectedCallback() { this.abort?.abort(); }
    async change(row, quantity, trigger) {
      if (this.busy) return;
      this.busy = true;
      const key = row.dataset.lineKey, sectionId = this.getAttribute('section-id');
      const controller = window.__TJS_CART_CONTROLLER_INSTANCE__;
      const nativeDrawer = document.querySelector('hdt-cart-drawer');
      const drawerSection = controller?.sectionId || nativeDrawer?.getAttribute('section-id');
      const sectionIds = [sectionId, drawerSection].filter(Boolean);
      const error = this.querySelector('[data-cart-error]');
      error.hidden = true;
      const controls = [...this.querySelectorAll('button,input,select')];
      const disabled = controls.map(control => control.disabled);
      controls.forEach(control => control.disabled = true);
      this.setAttribute('aria-busy','true');
      const triggerName = trigger.name;
      try {
        const mutate = () => fetch(`${window.Shopify?.routes?.root || '/'}cart/change.js`, {
          method:'POST', headers:{'Content-Type':'application/json',Accept:'application/json'},
          body:JSON.stringify({id:key,quantity,sections:sectionIds,sections_url:location.pathname})
        });
        const response = await (controller?.withInternalMutation ? controller.withInternalMutation(mutate) : mutate());
        const cart = await response.json();
        if (!response.ok || cart.errors) throw Error(cart.description || cart.message || 'Unable to update your bag. Please try again.');
        let html = cart.sections?.[sectionId];
        if (!html) {
          const url = new URL(location.href); url.searchParams.set('section_id', sectionId);
          const refreshed = await fetch(url,{cache:'no-store'});
          if (!refreshed.ok) throw Error('Your bag changed, but could not refresh. Please reload before checkout.');
          html = await refreshed.text();
        }
        const next = new DOMParser().parseFromString(html,'text/html').querySelector('june-page-cart');
        if (!next) throw Error('Your bag changed, but could not refresh. Please reload before checkout.');
        this.replaceWith(next);
        if (controller) {
          if (cart.sections?.[controller.sectionId]) controller.replaceRoot(cart.sections[controller.sectionId],{open:false});
          controller.updateCartCount(cart.item_count);
          controller.dispatchUpdated(cart,null,'line-change');
        } else {
          document.dispatchEvent(new CustomEvent('cart:update', {detail:{cartData:cart,source:'june-page-cart',actionAfterATC:'no_action'}}));
          if (!nativeDrawer) document.dispatchEvent(new CustomEvent('cart:count:update', {detail:{item_count:cart.item_count}}));
        }
        const nextRow = [...next.querySelectorAll('[data-line-key]')].find(node => node.dataset.lineKey === key);
        const focus = (nextRow && (triggerName ? nextRow.querySelector(`[name="${triggerName}"]`) : nextRow.querySelector('[data-page-cart-remove]'))) || next.querySelector('button,a,input') || next;
        if (focus === next) next.tabIndex = -1;
        focus.focus({preventScroll:true});
      } catch (cause) {
        row.querySelectorAll('[name="updates[]"]').forEach(input => input.value = input.defaultValue);
        error.textContent = cause.message || 'Unable to update your bag. Please try again.';
        error.hidden = false;
      } finally {
        controls.forEach((control,index) => control.disabled = disabled[index]);
        this.busy = false; this.removeAttribute('aria-busy');
      }
    }
  }
  customElements.define('june-page-cart', JunePageCart);
})();
