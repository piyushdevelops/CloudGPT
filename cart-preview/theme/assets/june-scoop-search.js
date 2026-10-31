(() => {
  if (customElements.get('june-scoop-search')) return;
  class JuneScoopSearch extends HTMLElement {
    connectedCallback() {
      if (this.controller) return;
      this.header = document.getElementById(this.dataset.header);
      if (!this.header) return;
      this.config = JSON.parse(this.querySelector('[data-config]').textContent);
      this.controller = new AbortController();
      const signal = this.controller.signal;
      this.overlay = this.querySelector('template').content.firstElementChild.cloneNode(true);
      this.overlay.style.cssText = this.getAttribute('style') || '';
      document.body.append(this.overlay);
      this.form = this.overlay.querySelector('form');
      this.input = this.overlay.querySelector('input[name="q"]');
      this.results = this.overlay.querySelector('[data-results]');
      this.status = this.overlay.querySelector('[data-status]');
      this.shape = this.overlay.querySelector('[data-shape]');
      this.orb = this.overlay.querySelector('[data-orb]');
      this.progress = 0;
      this.cartNotice=JSON.parse(this.querySelector('[data-cart-config]')?.textContent||'{}');
      this.cartCount=this.cartNotice.count||0;
      document.addEventListener('variant:add',e=>{if(!e.detail?.data?.didError)this.notifyCart();},{signal});
      document.addEventListener('cart:count:update',e=>{const count=e.detail?.item_count;if(!Number.isSafeInteger(count))return;const increased=count>this.cartCount;this.cartCount=count;if(increased)this.notifyCart();},{signal});
      this.header.addEventListener('click', e => {
        const toggle = e.target.closest('[data-june-search-open],[data-tjs-desktop-search-toggle]');
        if (!toggle || !this.canOpen()) return;
        e.preventDefault(); e.stopImmediatePropagation(); this.open(toggle);
      }, {capture:true,signal});
      this.overlay.querySelector('[data-close]').addEventListener('click', () => this.close(), {signal});
      document.addEventListener('keydown', e => {
        if(this.toast && e.key==='Escape'){e.preventDefault();this.clearCart();return;}
        if (this.active && e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); this.close(); }
      }, {capture:true,signal});
      document.addEventListener('pointerdown', e => {
        if (this.active && this.config.outside_close && !this.overlay.contains(e.target) && !e.target.closest('[data-june-search-open],[data-tjs-desktop-search-toggle]')) this.close(false);
      }, {signal});
      document.addEventListener('focusin', e => {
        if(this.active && !this.overlay.contains(e.target) && e.target !== this.trigger) this.close(false);
      }, {signal});
      window.addEventListener('scroll', () => {if(this.active && Math.abs(window.scrollY-this.openScroll)>24)this.close(false);}, {passive:true,signal});
      window.addEventListener('resize', () => {if(this.active && Math.abs(window.innerWidth-this.openWidth)>8)this.close(false,true);}, {signal});
      this.input.addEventListener('input', () => this.queueResults(), {signal});
      this.input.addEventListener('keydown', e => {
        if(e.key==='ArrowDown' && !this.results.hidden){const link=this.results.querySelector('a');if(link){e.preventDefault();link.focus();}}
      }, {signal});
      this.form.addEventListener('submit', e => {if(!this.input.value.trim()){e.preventDefault();this.input.focus();}}, {signal});
    }
    notifyCart(){
      if(document.querySelector('june-cart-preview[data-enabled="true"]'))return;
      if(!this.cartNotice.enabled||document.hidden)return;
      if(this.active){this.pendingCart=true;return;}
      clearTimeout(this.cartTimer);
      if(this.toast){this.cartTimer=setTimeout(()=>this.clearCart(),this.cartNotice.hold*1000);return;}
      const c=this.config,mobile=innerWidth<1150,height=mobile?c.height_mobile:c.height_desktop,width=Math.min(mobile?c.width_mobile:c.width_desktop,innerWidth-c.edge*2);
      this.toast=document.createElement('div');this.toast.className='jss-cart-notice';this.toast.style.cssText=this.getAttribute('style')||'';
      this.toast.style.width=width+'px';this.toast.style.height=height+'px';this.toast.style.borderRadius=Math.min(c.radius,height/2)+'px';
      const source=this.header.querySelector(mobile?'.tjs-ph__mobile-scoop':'.tjs-ph__desktop-scoop');const rect=source?.getBoundingClientRect();const visible=rect?.width&&rect.height&&rect.bottom>0;
      this.toast.style.top=(visible?Math.max(0,rect.top+c.drop):Math.max(8,c.drop))+'px';
      if(visible)this.toast.style.left=(Math.max(c.edge,Math.min(innerWidth-width-c.edge,rect.left+rect.width/2-width/2))+width/2)+'px';
      this.toast.style.setProperty('--jss-fill',c.fill||(source?getComputedStyle(source.querySelector('path')).fill:'#17151c'));
      this.toast.style.setProperty('--jss-notice-duration',c.motion&&!matchMedia('(prefers-reduced-motion: reduce)').matches?'320ms':'0ms');
      const check=document.createElement('span');check.className='jss-cart-check';check.textContent='✓';check.setAttribute('aria-hidden','true');
      const message=document.createElement('span');message.className='jss-cart-message';message.setAttribute('role','status');
      const close=document.createElement('button');close.type='button';close.className='jss-cart-close';close.setAttribute('aria-label',this.cartNotice.close_label);close.textContent='×';close.onclick=()=>this.clearCart();
      this.toast.append(check,message,close);document.body.append(this.toast);message.textContent=this.cartNotice.message;
      this.cartHidden=visible?[source,...source.parentElement.querySelectorAll('button,a')].filter(n=>!n.classList.contains('jss-source-hidden')):[];this.cartHidden.forEach(n=>n.classList.add('jss-source-hidden'));
      this.cartTimer=setTimeout(()=>this.clearCart(),this.cartNotice.hold*1000);
      this.toast.addEventListener('pointerenter',()=>clearTimeout(this.cartTimer));this.toast.addEventListener('pointerleave',()=>{if(!this.toast?.contains(document.activeElement))this.cartTimer=setTimeout(()=>this.clearCart(),this.cartNotice.hold*1000);});
      this.toast.addEventListener('focusin',()=>clearTimeout(this.cartTimer));this.toast.addEventListener('focusout',()=>{this.cartTimer=setTimeout(()=>this.clearCart(),this.cartNotice.hold*1000);});
    }
    clearCart(){clearTimeout(this.cartTimer);if(this.toast?.contains(document.activeElement))this.header.querySelector('a[href*="/cart"]')?.focus({preventScroll:true});this.toast?.remove();this.toast=null;this.cartHidden?.forEach(n=>n.classList.remove('jss-source-hidden'));this.cartHidden=[];}
    canOpen() {
      const mobile=window.innerWidth<1150;
      if(!(mobile?this.config.mobile:this.config.desktop))return false;
      const source=this.header.querySelector(mobile?'.tjs-ph__mobile-scoop':'.tjs-ph__desktop-scoop');
      if(!source || !source.getBoundingClientRect().width || !source.getBoundingClientRect().height || getComputedStyle(source).display==='none')return false;
      if(document.documentElement.classList.contains('tjs-ph-menu-open'))return false;
      this.source=source;this.mobile=mobile;return true;
    }
    sample(path) {
      const length=path.getTotalLength();return Array.from({length:120},(_,i)=>{const p=path.getPointAtLength(length*i/120);return{x:p.x,y:p.y};});
    }
    open(trigger) {
      if(this.active)return;
      this.clearCart();
      cancelAnimationFrame(this.frame);
      if(this.logo)this.finish();
      this.trigger=trigger;this.active=true;this.progress=0;
      this.openScroll=window.scrollY;this.openWidth=window.innerWidth;
      const rect=this.source.getBoundingClientRect(),vb=this.source.viewBox.baseVal;
      this.start={x:rect.left,y:rect.top,w:rect.width,h:rect.height};
      const initial=this.sample(this.source.querySelector('path'));
      this.initial=initial.map(p=>({x:(p.x-vb.x)/vb.width,y:(p.y-vb.y)/vb.height}));
      const c=this.config,h=this.mobile?c.height_mobile:c.height_desktop;
      const w=Math.min(this.mobile?c.width_mobile:c.width_desktop,window.innerWidth-c.edge*2);
      const x=Math.max(c.edge,Math.min(window.innerWidth-w-c.edge,rect.left+rect.width/2-w/2));
      this.end={x,y:Math.max(0,rect.top+c.drop),w,h};
      this.fill=getComputedStyle(this.source.querySelector('path')).fill;
      this.overlay.style.setProperty('--jss-fill',c.fill||this.fill);
      this.overlay.style.setProperty('--jss-h',h+'px');
      this.overlay.style.setProperty('--jss-gap',c.gap+'px');
      this.overlay.style.setProperty('--jss-radius',Math.min(c.radius,h/2)+'px');
      this.overlay.hidden=false;this.overlay.dataset.open='true';
      const container=this.source.parentElement;
      this.hiddenControls=[...container.querySelectorAll('button,a')].filter(node=>!node.classList.contains('tjs-ph__brand')&&!node.closest('.tjs-ph__brand'));
      this.hiddenControls.forEach(node=>node.classList.add('jss-source-hidden'));
      this.brand=container.querySelector('.tjs-ph__brand');
      this.source.classList.add('jss-source-hidden');
      if(this.brand){this.logo=this.brand.cloneNode(true);this.logo.removeAttribute('id');this.logo.removeAttribute('href');this.logo.removeAttribute('aria-label');this.logo.setAttribute('aria-hidden','true');this.logo.className='jss-logo';this.logo.removeAttribute('style');const original=[this.brand,...this.brand.querySelectorAll('*')],copies=[this.logo,...this.logo.querySelectorAll('*')];copies.forEach((node,i)=>{node.removeAttribute('id');const style=getComputedStyle(original[i]);node.style.font=style.font;node.style.letterSpacing=style.letterSpacing;node.style.color=style.color;});this.overlay.append(this.logo);this.brand.classList.add('jss-source-hidden');}
      trigger.setAttribute('aria-expanded','true');
      this.oldControls=trigger.getAttribute('aria-controls');trigger.setAttribute('aria-controls',this.overlay.id);
      this.form.inert=false;this.results.hidden=true;this.status.textContent='';
      this.paint(0);
      this.input.focus({preventScroll:true});
      this.animate(1);if(this.input.value.trim())this.queueResults();
    }
    paint(value) {
      const p=Math.max(0,Math.min(1,value)),smooth=x=>x*x*(3-2*x),split=smooth(Math.max(0,(p-.2)/.8));
      const mix=(a,b)=>a+(b-a)*p,c=this.config;
      const w=mix(this.start.w,this.end.w),h=mix(this.start.h,this.end.h),body=w-(this.end.h+c.gap)*split;
      const radius=Math.min(c.radius,h/2),k=.55228475;
      const target=document.createElementNS('http://www.w3.org/2000/svg','path');
      target.setAttribute('d',`M${radius} 0H${body-radius}C${body-radius*(1-k)} 0 ${body} ${radius*(1-k)} ${body} ${radius}V${h-radius}C${body} ${h-radius*(1-k)} ${body-radius*(1-k)} ${h} ${body-radius} ${h}H${radius}C${radius*(1-k)} ${h} 0 ${h-radius*(1-k)} 0 ${h-radius}V${radius}C0 ${radius*(1-k)} ${radius*(1-k)} 0 ${radius} 0Z`);
      const points=this.sample(target);
      this.shape.setAttribute('d',points.map((b,i)=>{const a=this.initial[i];return(i?'L':'M')+mix(a.x*w,b.x).toFixed(2)+' '+mix(a.y*h,b.y).toFixed(2);}).join(' ')+'Z');
      const svg=this.shape.ownerSVGElement;svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
      this.orb.setAttribute('cx',w-this.end.h/2);this.orb.setAttribute('cy',h/2);this.orb.setAttribute('r',this.end.h/2*split);
      this.overlay.style.left=mix(this.start.x,this.end.x)+'px';this.overlay.style.top=mix(this.start.y,this.end.y)+'px';this.overlay.style.width=w+'px';this.overlay.style.height=h+'px';
      const reveal=smooth(Math.max(0,(p-.5)/.5));this.overlay.style.setProperty('--jss-reveal',reveal);this.overlay.style.setProperty('--jss-body',body+'px');this.overlay.style.setProperty('--jss-shift',(1-reveal)*6+'px');
      if(this.logo){this.logo.style.opacity=Math.max(0,1-p*4);this.logo.style.transform=`translateY(${-p*6}px)`;}
    }
    animate(to) {
      cancelAnimationFrame(this.frame);
      const from=this.progress,start=performance.now(),duration=this.config.motion&&!matchMedia('(prefers-reduced-motion: reduce)').matches?this.config.duration*Math.abs(to-from):0;
      const run=now=>{const elapsed=duration?Math.min(1,(now-start)/duration):1;const ease=1-Math.pow(1-elapsed,3);this.progress=from+(to-from)*ease;this.paint(this.progress);if(elapsed<1)this.frame=requestAnimationFrame(run);else if(to===0)this.finish();};
      this.frame=requestAnimationFrame(run);
    }
    close(restore=true,instant=false) {
      if(!this.active)return;this.active=false;this.form.inert=true;this.results.hidden=true;
      clearTimeout(this.debounce);this.request?.abort();this.sequence=(this.sequence||0)+1;
      this.trigger?.setAttribute('aria-expanded','false');if(this.oldControls)this.trigger?.setAttribute('aria-controls',this.oldControls);
      this.restoreFocus=restore;this.overlay.dataset.open='false';if(this.overlay.contains(document.activeElement))document.activeElement.blur();
      if(instant){cancelAnimationFrame(this.frame);this.finish();}else this.animate(0);
    }
    finish(){this.overlay.hidden=true;this.source?.classList.remove('jss-source-hidden');this.brand?.classList.remove('jss-source-hidden');this.hiddenControls?.forEach(node=>node.classList.remove('jss-source-hidden'));this.logo?.remove();this.logo=null;this.progress=0;if(this.restoreFocus)this.trigger?.focus({preventScroll:true});this.restoreFocus=false;if(this.pendingCart){this.pendingCart=false;this.notifyCart();}}
    queueResults(){
      clearTimeout(this.debounce);this.request?.abort();this.sequence=(this.sequence||0)+1;this.results.hidden=true;this.status.textContent='';
      if(!this.config.suggestions||this.input.value.trim().length<this.config.min_chars)return;
      const sequence=this.sequence;this.debounce=setTimeout(()=>this.fetchResults(sequence),this.config.debounce);
    }
    async fetchResults(sequence){
      this.request=new AbortController();const query=this.input.value.trim();
      const url=new URL(this.dataset.predictive,location.origin);url.pathname=url.pathname.replace(/\.json$/,'')+'.json';url.searchParams.set('q',query);url.searchParams.set('resources[type]','product');url.searchParams.set('resources[limit]',this.config.limit);
      try{
        const response=await fetch(url,{signal:this.request.signal,headers:{Accept:'application/json'}});if(!response.ok)throw Error('Search unavailable');const data=await response.json();
        if(sequence!==this.sequence||!this.active)return;
        const products=data.resources?.results?.products||[];this.results.replaceChildren();
        for(const product of products){
          const link=document.createElement('a'),dest=new URL(product.url,location.origin);if(dest.origin!==location.origin)continue;link.href=dest.href;
          if(this.config.images&&product.image){const image=document.createElement('img');image.src=product.image;image.alt='';image.width=36;image.height=40;link.append(image);}
          const title=document.createElement('span');title.textContent=product.title;link.append(title);this.results.append(link);
        }
        this.appendViewAll(query);this.results.hidden=false;this.status.textContent=products.length?this.config.results_label:this.config.empty_label;
      }catch(error){if(error.name==='AbortError'||sequence!==this.sequence||!this.active)return;this.results.replaceChildren();this.appendViewAll(query);this.results.hidden=false;this.status.textContent=this.config.fallback_label;}
    }
    appendViewAll(query){const link=document.createElement('a'),url=new URL(this.form.action);url.searchParams.set('q',query);url.searchParams.set('type','product');link.href=url.href;link.textContent=this.config.all_label;link.className='jss-all';this.results.append(link);}
    disconnectedCallback(){this.clearCart();this.controller?.abort();clearTimeout(this.debounce);this.request?.abort();cancelAnimationFrame(this.frame);this.source?.classList.remove('jss-source-hidden');this.brand?.classList.remove('jss-source-hidden');this.hiddenControls?.forEach(node=>node.classList.remove('jss-source-hidden'));this.overlay?.remove();this.controller=null;}
  }
  customElements.define('june-scoop-search',JuneScoopSearch);
})();


