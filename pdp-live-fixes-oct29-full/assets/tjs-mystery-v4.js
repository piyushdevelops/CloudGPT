/* THE JUNE SHOP — Mystery Box V5.5 mobile slide-to-unlock + proven V4.7 cart path */
(function(){
  if (window.__TJS_MYSTERY_V55__) return;
  window.__TJS_MYSTERY_V55__ = true;

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motion = () => Object.assign({enabled:true,level:'expressive',tapeSlap:true,boxTilt:true,highlightSwipe:true,tierFill:true,numberFlip:true,kineticValue:true,shakeHalo:true,journeyLine:true,stickyMorph:true}, window.TJSMysteryMotion || {});
  const money = n => '₹' + Math.round(Number(n || 0)).toLocaleString('en-IN');
  const canAnimate = () => !reduceMotion && motion().enabled !== false;

  function announceTier(state){ document.dispatchEvent(new CustomEvent('tjs:mystery-tier-change',{detail:state})); }

  function animateValue(el,value,delay){
    if (!el || el.textContent === value) return;
    if (!canAnimate() || motion().numberFlip === false){ el.textContent=value; return; }
    setTimeout(()=>{
      el.classList.remove('is-entering');
      el.classList.add('is-changing');
      setTimeout(()=>{
        el.textContent=value;
        el.classList.remove('is-changing');
        el.classList.add('is-entering');
        setTimeout(()=>el.classList.remove('is-entering'),190);
      },120);
    },delay||0);
  }

  function swapValues(scope,state){
    if(!scope || !state) return;
    const map={price:money(state.price),value:money(state.guaranteedValue)+'+',save:money(state.saving)+'+',tape:money(state.guaranteedValue)+'+ GUARANTEED'};
    const delays={price:0,value:55,save:110,tape:0};
    Object.keys(map).forEach(key=>scope.querySelectorAll('[data-mystery-bind="'+key+'"]').forEach(el=>animateValue(el,map[key],delays[key])));
  }

  function initTilt(root){
    const media=root.querySelector('.tjs-mv4-hero__media');
    const target=root.querySelector('[data-mystery-tilt]');
    if(!media||!target||!canAnimate()||motion().boxTilt===false||window.matchMedia('(max-width: 749px)').matches) return;
    let tx=0,ty=0,cx=0,cy=0,raf=0;
    const strength=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tjs-tilt-strength'))||3;
    function render(){cx+=(tx-cx)*.10;cy+=(ty-cy)*.10;target.style.transform=`rotateX(${cy*-strength}deg) rotateY(${cx*strength}deg) translateY(${-Math.abs(cx*cy)*4}px)`;if(Math.abs(tx-cx)>.002||Math.abs(ty-cy)>.002)raf=requestAnimationFrame(render);else raf=0;}
    media.addEventListener('pointermove',e=>{const r=media.getBoundingClientRect();tx=((e.clientX-r.left)/r.width-.5)*2;ty=((e.clientY-r.top)/r.height-.5)*2;if(!raf)raf=requestAnimationFrame(render);});
    media.addEventListener('pointerleave',()=>{tx=0;ty=0;if(!raf)raf=requestAnimationFrame(render);});
  }

  function initHero(root){
    if(!root||root.dataset.tjsInit==='1')return;
    root.dataset.tjsInit='1';
    const cfgEl=root.querySelector('[data-mystery-config]'); if(!cfgEl)return;
    let cfg={}; try{cfg=JSON.parse(cfgEl.textContent)}catch(e){console.error('[TJS Mystery] invalid config',e);return;}

    const tiers=Array.from(root.querySelectorAll('[data-mystery-tier]'));
    const form=root.querySelector('.tjs-mv4-form');
    const variantInput=form && form.querySelector('input[name="id"]');
    const primary=root.querySelector('[data-mystery-primary-cta]');
    const mobileSlider=root.querySelector('[data-mystery-mobile-slider]');
    const mobileSliderLabel=mobileSlider&&mobileSlider.querySelector('[data-slider-label]');
    const sticky=root.querySelector('[data-mystery-sticky]');
    const stickyBtn=root.querySelector('[data-mystery-sticky-button]');
    let state=null,stickyShown=false,busy=false,sliderApi=null;

    function setStatus(message,type){
      const status=root.querySelector('[data-mystery-cart-status]');
      if(!status)return;
      status.textContent=message||'';
      status.hidden=!message;
      status.classList.toggle('is-error',type==='error');
      status.classList.toggle('is-success',type==='success');
    }

    function setPrimaryState(){
      if(!state) return;
      const unavailable = !state.variantId || state.available===false;
      if(primary){
        const label=primary.querySelector('[data-cta-label]');
        primary.disabled = unavailable || busy;
        primary.setAttribute('aria-disabled', primary.disabled ? 'true':'false');
        if(label && !busy) label.textContent = unavailable ? (cfg.soldOutText||'THIS MYSTERY IS SOLD OUT') : (cfg.ctaText||'UNLOCK MY BOX');
      }
      if(mobileSlider){
        const disabled=unavailable||busy;
        mobileSlider.setAttribute('aria-disabled',disabled?'true':'false');
        mobileSlider.classList.toggle('is-disabled',disabled);
        if(mobileSliderLabel){
          if(busy) mobileSliderLabel.textContent=cfg.addingText||'ADDING…';
          else if(unavailable) mobileSliderLabel.textContent=cfg.soldOutText||'SOLD OUT';
          else if(!mobileSlider.classList.contains('is-complete')) mobileSliderLabel.textContent=cfg.mobileSliderText||'SLIDE TO UNLOCK';
        }
      }
    }

    function selectTier(index,focus){
      const tier=cfg.tiers && cfg.tiers[index];
      if(!tier || !tier.variantId) return;
      state={
        index,
        variantId:String(tier.variantId),
        price:Number(tier.price),
        guaranteedValue:Number(tier.guaranteedValue),
        saving:Math.max(0,Number(tier.guaranteedValue)-Number(tier.price)),
        available:tier.available!==false,
        label:tier.label||''
      };
      if(sliderApi) sliderApi.reset(true);
      tiers.forEach((btn,i)=>{
        const selected=i===index;
        btn.setAttribute('aria-pressed',selected?'true':'false');
        btn.classList.toggle('is-selected',selected);
        btn.dataset.selected=selected?'true':'false';
        if(selected&&focus)btn.focus();
      });
      if(variantInput) variantInput.value=state.variantId;
      swapValues(root,state);
      if(sticky) swapValues(sticky,state);
      setPrimaryState();
      setStatus('',null);
      announceTier(state);
    }

    function initSlideUnlock(){
      if(!mobileSlider || cfg.mobileSliderEnabled===false) return null;
      const thumb=mobileSlider.querySelector('[data-slider-thumb]');
      const label=mobileSlider.querySelector('[data-slider-label]');
      if(!thumb) return null;
      let dragging=false,pointerId=null,progress=0;
      const threshold=Math.max(.5,Math.min(.95,Number(mobileSlider.dataset.threshold||cfg.mobileSliderThreshold||.8)));
      const isMobile=()=>window.matchMedia('(max-width: 749px)').matches;
      const maxTravel=()=>Math.max(0,mobileSlider.clientWidth-thumb.offsetWidth-8);
      const setProgress=(p,instant)=>{
        progress=Math.max(0,Math.min(1,p));
        const x=maxTravel()*progress;
        mobileSlider.style.setProperty('--slide-x',x+'px');
        mobileSlider.style.setProperty('--slide-p',String(progress));
        mobileSlider.style.setProperty('--slide-label-opacity',String(Math.max(.08,1-progress*.92)));
        mobileSlider.classList.toggle('is-returning',!instant&&!dragging&&progress===0);
      };
      const setLabel=text=>{if(label)label.textContent=text||'';};
      const reset=(instant)=>{
        dragging=false;pointerId=null;
        mobileSlider.classList.remove('is-dragging','is-complete','is-returning');
        if(instant) mobileSlider.classList.add('is-instant');
        setProgress(0,true);
        requestAnimationFrame(()=>mobileSlider.classList.remove('is-instant'));
        if(label&&state) setLabel((!state.variantId||state.available===false)?(cfg.soldOutText||'SOLD OUT'):(cfg.mobileSliderText||'SLIDE TO UNLOCK'));
      };
      const complete=()=>{
        dragging=false;pointerId=null;
        setProgress(1,false);
        mobileSlider.classList.remove('is-dragging','is-returning');
        mobileSlider.classList.add('is-complete');
        setLabel(cfg.mobileSliderSuccessText||'UNLOCKED ✓');
        try{if(navigator.vibrate)navigator.vibrate(18);}catch(_e){}
        setTimeout(()=>addSelected(),90);
      };
      const failBack=()=>{
        mobileSlider.classList.remove('is-dragging');
        mobileSlider.classList.add('is-returning');
        dragging=false;pointerId=null;
        setProgress(0,false);
        setTimeout(()=>mobileSlider.classList.remove('is-returning'),260);
      };
      thumb.addEventListener('pointerdown',e=>{
        if(!isMobile()||busy||mobileSlider.getAttribute('aria-disabled')==='true')return;
        dragging=true;pointerId=e.pointerId;mobileSlider.classList.remove('is-returning','is-complete');mobileSlider.classList.add('is-dragging');
        try{thumb.setPointerCapture(pointerId);}catch(_e){}
        e.preventDefault();
      });
      thumb.addEventListener('pointermove',e=>{
        if(!dragging||e.pointerId!==pointerId)return;
        const r=mobileSlider.getBoundingClientRect();
        const travel=maxTravel();
        const x=e.clientX-r.left-thumb.offsetWidth/2-4;
        setProgress(travel?x/travel:0,true);
        e.preventDefault();
      });
      const end=e=>{
        if(!dragging||e.pointerId!==pointerId)return;
        try{thumb.releasePointerCapture(pointerId);}catch(_e){}
        progress>=threshold?complete():failBack();
        e.preventDefault();
      };
      thumb.addEventListener('pointerup',end);
      thumb.addEventListener('pointercancel',failBack);
      mobileSlider.addEventListener('keydown',e=>{
        if((e.key==='Enter'||e.key===' ')&&mobileSlider.getAttribute('aria-disabled')!=='true'&&!busy){e.preventDefault();complete();}
      });
      window.addEventListener('resize',()=>{if(!dragging&&!mobileSlider.classList.contains('is-complete'))setProgress(0,true);},{passive:true});
      return {reset,setLabel,complete};
    }

    sliderApi=initSlideUnlock();
    tiers.forEach((btn,i)=>btn.addEventListener('click',(e)=>{e.preventDefault();selectTier(i,true);}));
    const first=(cfg.tiers||[]).findIndex(t=>t&&t.variantId);
    if(first>=0) selectTier(first,false);

    const stickyAnchor=(window.matchMedia('(max-width: 749px)').matches&&mobileSlider&&cfg.mobileSliderEnabled!==false)?mobileSlider:primary;
    if(sticky&&stickyAnchor&&cfg.stickyEnabled){
      const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
        const show=!entry.isIntersecting;
        sticky.classList.toggle('is-visible',show);
        if(show&&!stickyShown&&canAnimate()&&motion().stickyMorph!==false){stickyShown=true;sticky.classList.add('is-morphing');setTimeout(()=>sticky.classList.remove('is-morphing'),560);}
      }),{threshold:.12});
      observer.observe(stickyAnchor);
    }
    if(stickyBtn&&primary)stickyBtn.addEventListener('click',()=>primary.click());

    function fireCartEvents(){
      ['cart:reload','cart:refresh'].forEach(name=>{
        const evt=new CustomEvent(name,{bubbles:true,detail:{source:'tjs-mystery'}});
        document.dispatchEvent(evt);
        try{document.documentElement.dispatchEvent(new CustomEvent(name,{bubbles:true,detail:{source:'tjs-mystery'}}));}catch(_e){}
      });
    }

    function getDrawer(){
      return document.querySelector('hdt-cart-drawer') || document.getElementById('CartDrawer') || document.querySelector('[data-cart-drawer],cart-drawer');
    }

    function getDrawerSectionId(drawer){
      if(!drawer) return '';
      const section=drawer.closest('[id^="shopify-section-"]');
      if(section && section.id) return section.id.replace(/^shopify-section-/, '');
      return drawer.dataset.sectionId || drawer.getAttribute('data-section-id') || '';
    }

    async function hardRefreshDrawer(){
      const current=getDrawer();
      const sectionId=getDrawerSectionId(current);
      if(!current || !sectionId) return false;
      try{
        const base=(window.Shopify&&window.Shopify.routes&&window.Shopify.routes.root)||'/';
        const url=base+'?sections='+encodeURIComponent(sectionId)+'&_='+Date.now();
        const res=await fetch(url,{headers:{'Accept':'application/json','X-Requested-With':'XMLHttpRequest'},credentials:'same-origin',cache:'no-store'});
        if(!res.ok) return false;
        const json=await res.json();
        const html=json && json[sectionId];
        if(!html) return false;
        const doc=new DOMParser().parseFromString(html,'text/html');
        const fresh=doc.querySelector('hdt-cart-drawer') || doc.getElementById('CartDrawer') || doc.querySelector('[data-cart-drawer],cart-drawer');
        if(!fresh) return false;
        current.replaceWith(fresh);
        return true;
      }catch(err){
        console.warn('[TJS Mystery] drawer hard refresh failed',err);
        return false;
      }
    }

    function openEcomusDrawer(){
      const drawer=getDrawer();
      if(drawer){
        try{ if(typeof drawer.openDialog==='function'){ drawer.openDialog(); return true; } }catch(_e){}
        try{ if(typeof drawer.open==='function'){ drawer.open(); return true; } }catch(_e){}
        try{ drawer.setAttribute('open',''); drawer.classList.add('is-open','active'); return true; }catch(_e){}
      }
      return false;
    }

    async function getCart(){
      const base=(window.Shopify&&window.Shopify.routes&&window.Shopify.routes.root)||'/';
      const res=await fetch(base+'cart.js',{headers:{'Accept':'application/json'},credentials:'same-origin'});
      if(!res.ok) throw new Error('Could not read the cart.');
      return res.json();
    }

    async function refreshAndOpenDrawer(){
      // Ecomus can refresh subtotal before line-items. Force a full server-rendered drawer refresh first.
      const replaced=await hardRefreshDrawer();
      fireCartEvents();
      await new Promise(r=>setTimeout(r,replaced?80:260));
      let opened=openEcomusDrawer();
      if(!opened){
        await new Promise(r=>setTimeout(r,350));
        if(!replaced) await hardRefreshDrawer();
        fireCartEvents();
        await new Promise(r=>setTimeout(r,120));
        opened=openEcomusDrawer();
      }
      if(!opened){
        // Last-resort fallback requested by merchant: preserve the cart and reload this PDP.
        window.location.reload();
      }
      return opened;
    }

    async function addSelected(){
      if(busy) return;
      if(!state || !state.variantId){ setStatus('Please select a Mystery Box first.','error'); return; }
      if(state.available===false){ setStatus('This Mystery Box is currently unavailable.','error'); return; }

      busy=true; root.dataset.cartBusy='1'; setPrimaryState();
      const label=primary&&primary.querySelector('[data-cta-label]');
      if(label) label.textContent=cfg.addingText||'ADDING…';
      setStatus('',null);

      try{
        const selectedVariantId=Number(state.variantId);
        const cart=await getCart();
        const alreadyInCart=(cart.items||[]).some(item=>Number(item.variant_id||item.id)===selectedVariantId);

        if(!alreadyInCart){
          const base=(window.Shopify&&window.Shopify.routes&&window.Shopify.routes.root)||'/';
          const response=await fetch(base+'cart/add.js',{
            method:'POST',
            headers:{'Accept':'application/json','Content-Type':'application/json','X-Requested-With':'XMLHttpRequest'},
            credentials:'same-origin',
            body:JSON.stringify({items:[{id:selectedVariantId,quantity:1}]})
          });
          if(!response.ok){
            let message='Unable to add this Mystery Box.';
            try{const err=await response.json();message=err.description||err.message||message;}catch(_e){}
            throw new Error(message);
          }
          await response.json();
        }

        await refreshAndOpenDrawer();
        document.dispatchEvent(new CustomEvent('tjs:mystery-added',{bubbles:true,detail:state}));
        const successText=alreadyInCart?(cfg.inCartText||'IN YOUR CART ✓'):(cfg.addedText||'ADDED ✓');
        if(label) label.textContent=successText;
        if(sliderApi) sliderApi.setLabel(successText);
        setStatus(alreadyInCart?(cfg.inCartMessage||'This Mystery Box is already in your cart.'):(cfg.addedMessage||'Added to your cart.'),'success');
      }catch(err){
        console.error('[TJS Mystery Box] add to cart failed',err);
        setStatus(err.message||'Unable to add this Mystery Box. Please try again.','error');
      }finally{
        setTimeout(()=>{busy=false;root.dataset.cartBusy='0';if(sliderApi)sliderApi.reset(false);setPrimaryState();},850);
      }
    }

    if(primary) primary.addEventListener('click',(e)=>{e.preventDefault();e.stopPropagation();addSelected();});

    // Safety: if any app/theme submits the form programmatically, keep it on our single AJAX path.
    if(form) form.addEventListener('submit',(e)=>{e.preventDefault();e.stopPropagation();},true);

    const hi=root.querySelector('.tjs-mv4-highlight');
    if(hi){if(!canAnimate()||motion().highlightSwipe===false)hi.classList.add('is-highlighted');else setTimeout(()=>hi.classList.add('is-highlighted'),220);}
    initTilt(root);
  }

  function initReveals(){
    const els=Array.from(document.querySelectorAll('.tjs-mv4 [data-reveal], .tjs-mv4-hero__tape, .tjs-mv4-value__tape, .tjs-mv4-journey__track'));
    if(!canAnimate()){els.forEach(el=>el.classList.add('is-visible'));return;}
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');if(entry.target.classList.contains('tjs-mv4-value__headline')){const panel=entry.target.closest('.tjs-mv4-value__panel');if(panel)panel.classList.add('is-energized');}io.unobserve(entry.target);}}),{threshold:.2});
    els.forEach(el=>io.observe(el));
  }

  function initListeners(){document.addEventListener('tjs:mystery-tier-change',e=>document.querySelectorAll('.tjs-mv4:not(.tjs-mv4-hero)').forEach(scope=>swapValues(scope,e.detail)));}

  function initShake(scope){
    if(!scope||scope.dataset.tjsShakeInit==='1')return;scope.dataset.tjsShakeInit='1';
    const box=scope.querySelector('[data-shake-box]'),response=scope.querySelector('[data-shake-response]'),halo=scope.querySelector('.tjs-mv4-shake__halo');if(!box||!response)return;
    let lines=[];try{lines=JSON.parse(scope.querySelector('[data-shake-lines]').textContent)}catch(e){} let i=0;
    const shake=()=>{if(canAnimate()){box.classList.remove('is-shaking');void box.offsetWidth;box.classList.add('is-shaking');if(halo&&motion().shakeHalo!==false){halo.classList.remove('is-pulsing');void halo.offsetWidth;halo.classList.add('is-pulsing');}}if(lines.length){response.classList.add('is-changing');setTimeout(()=>{response.textContent=lines[i%lines.length];i++;response.classList.remove('is-changing');},110);}};
    box.addEventListener('click',shake);box.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();shake();}});
  }

  function init(){document.querySelectorAll('[data-mystery-hero-root]').forEach(initHero);document.querySelectorAll('[data-mystery-shake-root]').forEach(initShake);initReveals();}
  initListeners();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  document.addEventListener('shopify:section:load',init);
})();
