(() => {
  if (customElements.get('june-happy-cart')) return;
  class JuneHappyCart extends HTMLElement {
    connectedCallback() {
      this.count = Number(this.dataset.count) || 0;
      this.link = this.closest('a');
      this.counter = this.link?.querySelector('[data-tjs-cart-count]');
      this.controller = new AbortController();
      this.revision = 0;
      this.onCount = event => {
        const count = event.detail?.item_count;
        if (typeof count === 'number') this.setCount(count);
      };
      document.addEventListener('cart:count:update', this.onCount, {signal:this.controller.signal});
      this.observer = new MutationObserver(() => {
        const text = this.counter?.textContent.trim();
        if (/^\d+$/.test(text || '')) this.setCount(Number(text));
      });
      if (this.counter) this.observer.observe(this.counter,{childList:true,characterData:true,subtree:true});
      this.setCount(this.count, false);
    }
    disconnectedCallback() {
      this.controller?.abort();
      this.observer?.disconnect();
      cancelAnimationFrame(this.frame);
      clearTimeout(this.timer);
      this.revision++;
    }
    setCount(count, animate = true) {
      if (!Number.isSafeInteger(count) || count < 0) return;
      const previous = this.count;
      this.count = count;
      const mood = count === 0 ? 0 : count === 1 ? 1 : count < 4 ? 2 : 3;
      this.dataset.count = String(count);
      this.dataset.mood = String(mood);
      this.querySelectorAll('[data-jhc-state]').forEach(node => {node.hidden = Number(node.dataset.jhcState) !== mood;});
      this.link?.setAttribute('aria-label',`Cart, ${count} ${count === 1 ? 'item' : 'items'}`);
      if (count === previous) return;
      cancelAnimationFrame(this.frame);
      clearTimeout(this.timer);
      const revision = ++this.revision;
      this.classList.remove('is-adding','is-removing');
      if (!animate || this.dataset.motion === 'false' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      this.frame = requestAnimationFrame(() => {
        this.frame = requestAnimationFrame(() => {
          if (!this.isConnected || revision !== this.revision) return;
          this.classList.add(count > previous ? 'is-adding' : 'is-removing');
          this.timer = setTimeout(() => this.classList.remove('is-adding','is-removing'),800);
        });
      });
    }
  }
  customElements.define('june-happy-cart', JuneHappyCart);
})();
