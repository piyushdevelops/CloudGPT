(() => {
 if(customElements.get('june-scoop-scroll'))return;
 class ScoopScroll extends HTMLElement{
  connectedCallback(){
   if(this.abort)return;this.header=document.getElementById(this.dataset.header);if(!this.header)return;
   this.c=JSON.parse(this.querySelector('script').textContent);this.abort=new AbortController();const signal=this.abort.signal;
   this.reduced=matchMedia('(prefers-reduced-motion: reduce)');this.records=[];this.progress=0;this.target=0;
   for(const mobile of [true,false]){
    if(!(mobile?this.c.mobile:this.c.desktop))continue;
    const source=this.header.querySelector(mobile?'.tjs-ph__mobile-scoop':'.tjs-ph__desktop-scoop');if(!source)continue;const brand=source.parentElement.querySelector('.tjs-ph__brand');if(!brand)continue;
    const path=source.querySelector('path');const record={mobile,source,brand,path,d:path.getAttribute('d'),viewBox:source.getAttribute('viewBox'),saved:new Map()};
    this.records.push(record);this.measure(record);
   }
   this.onScroll=()=>{const next=window.scrollY>this.c.threshold?1:window.scrollY<Math.max(0,this.c.threshold-24)?0:this.target;if(next!==this.target){this.target=next;this.animate();}};
   window.addEventListener('scroll',this.onScroll,{passive:true,signal});window.addEventListener('resize',()=>{cancelAnimationFrame(this.frame);this.records.forEach(r=>this.measure(r));this.paint(this.progress);this.onScroll();this.animate();},{signal});
   this.reduced.addEventListener('change',()=>this.animate(),{signal});this.onScroll();this.paint(this.progress);
  }
  set(r,node,key,value){let saved=r.saved.get(node);if(!saved){saved=new Map();r.saved.set(node,saved);}if(!saved.has(key))saved.set(key,[node.style.getPropertyValue(key),node.style.getPropertyPriority(key)]);node.style.setProperty(key,value,'important');}
  restore(r){for(const[node,properties]of r.saved)for(const[key,[value,priority]]of properties){if(value)node.style.setProperty(key,value,priority);else node.style.removeProperty(key);}r.path.setAttribute('d',r.d);r.source.setAttribute('viewBox',r.viewBox);}
  measure(r){
   this.restore(r);this.set(r,r.source,'display','block');this.set(r,r.brand,'display','flex');
   const style=getComputedStyle(r.source);r.width=parseFloat(style.width);r.height=parseFloat(style.height);r.top=parseFloat(style.top)||0;
   const vb=r.source.viewBox.baseVal,len=r.path.getTotalLength();r.points=Array.from({length:100},(_,i)=>{const p=r.path.getPointAtLength(len*i/100);return{x:(p.x-vb.x)/vb.width,y:(p.y-vb.y)/vb.height};});
   r.wordmark=r.brand.querySelector('.tjs-ph__reference-wordmark');r.fontSize=r.wordmark?parseFloat(getComputedStyle(r.wordmark).fontSize):16;
   r.active=(innerWidth<1150)===r.mobile;
   this.set(r,r.source,'animation','none');
  }
  paint(p){
   for(const r of this.records){if(!r.active)continue;const c=this.c;
    const cap=r.mobile?Math.max(96,innerWidth-192):Math.max(140,innerWidth-300);
    const width=Math.min(r.mobile?c.width_mobile:c.width_desktop,cap),height=r.mobile?c.height_mobile:c.height_desktop;
    const w=r.width+(width-r.width)*p,h=r.height+(height-r.height)*p,top=r.top+c.offset*p,radius=Math.min(h/2,c.radius);
    if(!Number.isFinite(w)||w<=0)continue;
    this.set(r,r.source,'width',w+'px');this.set(r,r.source,'height',h+'px');this.set(r,r.source,'top',top+'px');
    this.set(r,r.brand,'width',w+'px');this.set(r,r.brand,'height',h+'px');this.set(r,r.brand,'top',top+'px');
    if(r.wordmark)this.set(r,r.wordmark,'font-size',(r.fontSize+((r.mobile?c.font_mobile:c.font_desktop)-r.fontSize)*p)+'px');
    const target=document.createElementNS('http://www.w3.org/2000/svg','path'),k=.55228475;
    target.setAttribute('d',`M${radius} 0H${w-radius}C${w-radius*(1-k)} 0 ${w} ${radius*(1-k)} ${w} ${radius}V${h-radius}C${w} ${h-radius*(1-k)} ${w-radius*(1-k)} ${h} ${w-radius} ${h}H${radius}C${radius*(1-k)} ${h} 0 ${h-radius*(1-k)} 0 ${h-radius}V${radius}C0 ${radius*(1-k)} ${radius*(1-k)} 0 ${radius} 0Z`);
    const len=target.getTotalLength();r.path.setAttribute('d',r.points.map((a,i)=>{const b=target.getPointAtLength(len*i/r.points.length);return(i?'L':'M')+(a.x*w+(b.x-a.x*w)*p).toFixed(2)+' '+(a.y*h+(b.y-a.y*h)*p).toFixed(2);}).join(' ')+'Z');r.source.setAttribute('viewBox',`0 0 ${w} ${h}`);
   }
  }
  animate(){cancelAnimationFrame(this.frame);const from=this.progress,to=this.target,start=performance.now(),duration=this.c.motion&&!this.reduced.matches?this.c.duration*Math.abs(to-from):0;const tick=now=>{const t=duration?Math.min(1,(now-start)/duration):1;this.progress=from+(to-from)*(1-Math.pow(1-t,3));this.paint(this.progress);if(t<1)this.frame=requestAnimationFrame(tick);};this.frame=requestAnimationFrame(tick);}
  disconnectedCallback(){this.abort?.abort();cancelAnimationFrame(this.frame);this.records?.forEach(r=>this.restore(r));this.abort=null;}
 }
 customElements.define('june-scoop-scroll',ScoopScroll);
})();

