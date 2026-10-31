(() => {
 if(customElements.get('june-scoop-announcements'))return;
 class ScoopAnnouncements extends HTMLElement {
  connectedCallback(){
   if(this.abort)return;this.header=document.getElementById(this.dataset.header);if(!this.header)return;
   this.c=JSON.parse(this.querySelector('script').textContent);this.items=[...this.querySelectorAll('template')];if(!this.items.length)return;
   this.abort=new AbortController();const signal=this.abort.signal;this.index=0;this.reduced=matchMedia('(prefers-reduced-motion: reduce)');
   this.observer=new MutationObserver(()=>this.reset());
   this.observer.observe(this.header,{attributes:true,attributeFilter:['class']});this.observer.observe(document.documentElement,{attributes:true,attributeFilter:['class']});
   this.header.querySelectorAll('.tjs-ph__mobile-scoop,.tjs-ph__desktop-scoop').forEach(s=>this.observer.observe(s,{attributes:true,attributeFilter:['class','style']}));
   document.addEventListener('visibilitychange',()=>this.reset(),{signal});window.addEventListener('resize',()=>this.reset(),{signal});this.reduced.addEventListener('change',()=>this.reset(),{signal});
   this.schedule();
  }
  available(){
   const mobile=innerWidth<1150;if(document.hidden||this.reduced.matches||!(mobile?this.c.mobile:this.c.desktop))return false;
   this.source=this.header.querySelector(mobile?'.tjs-ph__mobile-scoop':'.tjs-ph__desktop-scoop');if(!this.source)return false;
   const style=getComputedStyle(this.source),r=this.source.getBoundingClientRect();
   return r.width>0&&r.height>0&&r.bottom>0&&style.visibility!=='hidden'&&style.display!=='none'&&!document.documentElement.classList.contains('tjs-ph-menu-open');
  }
  schedule(){clearTimeout(this.timer);if(this.available())this.timer=setTimeout(()=>this.show(),this.c.logo_hold*1000);}
  show(){
   if(!this.available())return;
   const parent=this.source.parentElement;this.brand=parent.querySelector('.tjs-ph__brand');if(!this.brand)return;
   const r=this.source.getBoundingClientRect(),p=parent.getBoundingClientRect(),mobile=innerWidth<1150;
   this.layer=document.createElement('div');this.layer.className='jsa-layer';this.layer.style.cssText=this.getAttribute('style')||'';
   const inset=mobile?this.c.inset_mobile:this.c.inset_desktop;
   Object.assign(this.layer.style,{left:(r.left-p.left+inset)+'px',top:(r.top-p.top)+'px',width:Math.max(60,r.width-inset*2)+'px',height:r.height+'px'});
   this.layer.append(this.items[this.index%this.items.length].content.cloneNode(true));this.index++;
   parent.append(this.layer);this.brand.classList.add('jsa-brand-active');this.hover=false;
   const track=this.layer.querySelector('.jsa-track'),clip=this.layer.querySelector('.jsa-clip');
   const distance=Math.max(0,track.scrollWidth-clip.clientWidth);const travel=distance/this.c.speed*1000;
   this.remaining=Math.max(this.c.message_hold*1000,travel+1800);
   if(distance&&this.c.motion){this.marquee=track.animate([{transform:'translateX(0)',offset:0},{transform:'translateX(0)',offset:.12},{transform:`translateX(-${distance}px)`,offset:.88},{transform:`translateX(-${distance}px)`,offset:1}],{duration:travel+1800,fill:'forwards',easing:'linear'});}
   else if(distance){track.style.whiteSpace='normal';track.style.fontSize='max(10px,.85em)';}
   this.enter=this.layer.animate([{opacity:0,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:this.c.motion?this.c.transition:0,fill:'both',easing:'cubic-bezier(.2,.7,.2,1)'});
   this.layer.addEventListener('pointerenter',()=>{this.hover=true;this.pauseClock();});this.layer.addEventListener('pointerleave',()=>{this.hover=false;this.resumeClock();});
   this.layer.addEventListener('focusin',()=>this.pauseClock());this.layer.addEventListener('focusout',()=>setTimeout(()=>this.resumeClock(),0));
   this.resumeClock();
  }
  pauseClock(){if(this.deadline){this.remaining=Math.max(0,this.deadline-performance.now());this.deadline=0;}clearTimeout(this.timer);this.marquee?.pause();}
  resumeClock(){if(!this.layer||this.hover||this.layer.contains(document.activeElement))return;clearTimeout(this.timer);this.marquee?.play();this.deadline=performance.now()+this.remaining;this.timer=setTimeout(()=>this.hide(),this.remaining);}
  hide(){if(!this.layer)return;const layer=this.layer;this.enter?.cancel();const exit=layer.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-6px)'}],{duration:this.c.motion?this.c.transition:0,fill:'forwards'});this.exit=exit;exit.onfinish=()=>{this.clear();this.schedule();};}
  clear(){clearTimeout(this.timer);this.exit?.cancel();this.enter?.cancel();this.marquee?.cancel();this.layer?.remove();this.layer=null;this.brand?.classList.remove('jsa-brand-active');this.deadline=0;}
  reset(){this.clear();this.schedule();}
  disconnectedCallback(){this.clear();this.abort?.abort();this.observer?.disconnect();this.abort=null;}
 }
 customElements.define('june-scoop-announcements',ScoopAnnouncements);
})();
