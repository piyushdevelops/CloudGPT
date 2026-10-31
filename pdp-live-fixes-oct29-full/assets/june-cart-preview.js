(() => {
  if (customElements.get('june-cart-preview')) return;
  class JuneCartPreview extends HTMLElement {
    connectedCallback() {
      if (this.controller || this.dataset.enabled !== 'true') return;
      this.cart = document.querySelector('hdt-cart-drawer');
      this.dialog = this.cart?.querySelector('#CartDrawer');
      if (!this.dialog) return;
      this.controller = new AbortController();
      const signal = this.controller.signal;
      this.headingNode = this.dialog.querySelector('.hdt-mini-cart__header-title');
      this.originalTitle = this.headingNode.textContent;
      this.announcement=document.createElement('span');this.announcement.className='sr-only';this.announcement.setAttribute('role','status');this.append(this.announcement);
      // Change only the post-add presentation. Native updates and tracking still run.
      document.addEventListener('cart:update', event => {
        const detail = event.detail;
        if (detail?.source !== 'product-form-component' || !detail.cartData?.sections?.[this.cart.sectionId]) return;
        if (this.dialog.open && !this.active) return;
        const action = detail.actionAfterATC || window.themeHDN?.settings?.actionAfterATC;
        if (action && action !== 'open_cart_drawer' && action !== 'no_action') return;
        detail.actionAfterATC = 'no_action';
        this.pending = true;
      }, {capture:true, signal});
      document.addEventListener('cart:drawer:render', () => {
        if (this.pending) { this.pending = false; this.open(); }
        else if (this.active) this.decorate();
      }, {signal});
      document.addEventListener('pointerdown', event => {
        if (this.active && !this.dialog.contains(event.target)) this.close();
      }, {capture:true, signal});
      document.addEventListener('click', event => {
        if (this.active && !this.dialog.contains(event.target)) this.close(false);
      }, {capture:true, signal});
      document.addEventListener('keydown', event => {
        if (!this.active) return;
        if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); this.close(); }
        else if (this.dialog.contains(event.target)) { this.keyboard = true; clearTimeout(this.timer); }
      }, {capture:true, signal});
      this.dialog.addEventListener('click', event => {
        if (!this.active) return;
        if (event.target.closest('[aria-controls="CartDrawer"]')) {
          event.preventDefault(); event.stopImmediatePropagation(); this.close();
        } else if (event.target.closest('.hdt-mini-cart__btn-viewcart')) {
          event.preventDefault(); event.stopImmediatePropagation(); this.close(false); this.cart.open();
        } else if (event.target.closest('.gokwik-checkout button,.hdt-mini-cart__btn-checkout')) {
          clearTimeout(this.timer);
          // Let the original checkout handler run first, then release the preview.
          queueMicrotask(() => this.close(false));
        }
      }, {capture:true, signal});
      this.dialog.addEventListener('pointerenter', event => { if(event.pointerType==='mouse'){this.hovered=true;clearTimeout(this.timer);} }, {signal});
      this.dialog.addEventListener('pointerleave', () => {this.hovered=false;this.arm();}, {signal});
      ['pointerdown','input','scroll'].forEach(name => this.dialog.addEventListener(name, () => this.arm(), {capture:true,passive:true,signal}));
      this.dialog.addEventListener('focusin', () => {this.keyboard=true;clearTimeout(this.timer);}, {signal});
      this.dialog.addEventListener('focusout', () => {queueMicrotask(()=>{if(!this.dialog.contains(document.activeElement)){this.keyboard=false;this.arm();}});}, {signal});
      window.addEventListener('resize', () => {if(this.active)this.position();}, {passive:true,signal});
      window.addEventListener('scroll', () => {if(this.active)this.position();}, {passive:true,signal});
      document.addEventListener('visibilitychange', () => {if(document.hidden)this.close(false);}, {signal});
    }
    position() {
      const anchors = [...document.querySelectorAll('[aria-controls="CartDrawer"],a[href$="/cart"]')];
      const anchor = anchors.find(el => !this.dialog.contains(el) && el.getBoundingClientRect().width && el.getBoundingClientRect().top >= 0 && el.getBoundingClientRect().top < 180);
      const rect = anchor?.getBoundingClientRect();
      const width = Math.min(Number(this.dataset.width)||380, innerWidth-24);
      this.dialog.style.setProperty('--jcp-width',width+'px');
      this.dialog.style.setProperty('--jcp-left',Math.max(12,Math.min(innerWidth-width-12,(rect?.right||innerWidth-12)-width))+'px');
      this.dialog.style.setProperty('--jcp-top',Math.max(12,Math.min(rect?.bottom+12||76,120))+'px');
    }
    decorate() {
      const link=this.dialog.querySelector('.hdt-mini-cart__btn-viewcart');
      if(link){if(!link.dataset.jcpOriginal)link.dataset.jcpOriginal=link.innerHTML;link.textContent=this.dataset.full||'View full cart';}
    }
    open() {
      if (this.dialog.open && !this.active) return;
      this.returnFocus=document.activeElement;
      this.active=true;this.keyboard=false;this.hovered=false;
      this.dialog.classList.add('june-cart-preview');
      this.headingNode.textContent=this.dataset.title||'Added to your bag.';
      this.decorate();this.position();
      this.announcement.textContent=this.headingNode.textContent;
      // Non-modal: no screen dimming, focus trap, or page scroll lock.
      this.dialog.setAttribute('open','');
      this.dialog.setAttribute('aria-label',this.headingNode.textContent);
      this.dialog.animate([{opacity:0,transform:'translateY(-8px) scale(.97)'},{opacity:1,transform:'none'}],{duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:220,easing:'cubic-bezier(.2,.8,.2,1)'});
      this.arm();
    }
    arm() {
      clearTimeout(this.timer);
      if(this.active&&!this.hovered&&!this.keyboard)this.timer=setTimeout(()=>this.close(),(Number(this.dataset.seconds)||5)*1000);
    }
    close(restore=true) {
      clearTimeout(this.timer);
      if(!this.active)return;
      const hadFocus=this.dialog.contains(document.activeElement);
      this.active=false;this.pending=false;
      this.dialog.removeAttribute('open');this.dialog.classList.remove('june-cart-preview');this.dialog.removeAttribute('aria-label');
      this.headingNode.textContent=this.originalTitle;
      const link=this.dialog.querySelector('.hdt-mini-cart__btn-viewcart');
      if(link?.dataset.jcpOriginal){link.innerHTML=link.dataset.jcpOriginal;delete link.dataset.jcpOriginal;}
      if(restore&&hadFocus&&this.returnFocus?.isConnected)this.returnFocus.focus({preventScroll:true});
    }
    disconnectedCallback(){this.close(false);this.announcement?.remove();this.controller?.abort();this.controller=null;}
  }
  customElements.define('june-cart-preview',JuneCartPreview);
})();
