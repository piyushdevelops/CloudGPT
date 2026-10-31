



if(!customElements.get('june-limited')){

 customElements.define('june-limited',class extends HTMLElement{

  connectedCallback(){

   if(this.controller)return;

   this.controller=new AbortController();const options={signal:this.controller.signal};

   this.buttons=[...this.querySelectorAll('[data-select]')];this.selected=0;

   this.reveal=this.querySelector('[data-reveal]');this.reveal.hidden=false;this.dataset.ready='true';this.revealHome=document.createComment('reveal home');this.reveal.before(this.revealHome);this.phone=matchMedia('(max-width:900px)');this.placeReveal=()=>{const scene=this.querySelector('[data-scene="'+this.selected+'"]');if(this.phone.matches)scene.querySelector('.jl__gifts-stage').before(this.reveal);else this.revealHome.after(this.reveal)};this.phone.addEventListener('change',this.placeReveal,options);this.placeReveal();this.setOpen(false);

   this.addEventListener('click',event=>{const button=event.target.closest('[data-select]');if(button&&this.contains(button))this.select(Number(button.dataset.select));if(event.target.closest('[data-reveal]'))this.setOpen(this.dataset.open!=='true');},options);

   this.addEventListener('keydown',event=>{const button=event.target.closest('[data-select]');if(!button)return;const index=this.buttons.indexOf(button);let next;if(event.key==='ArrowRight')next=(index+1)%this.buttons.length;if(event.key==='ArrowLeft')next=(index-1+this.buttons.length)%this.buttons.length;if(event.key==='Home')next=0;if(event.key==='End')next=this.buttons.length-1;if(next===undefined)return;event.preventDefault();this.select(next);this.buttons[next].focus();},options);

   this.addEventListener('shopify:block:select',event=>{const button=this.buttons.find(b=>b.dataset.block===event.detail.blockId);if(button){this.select(Number(button.dataset.select));this.setOpen(true);}},options);

  }

  setOpen(open){

   this.dataset.open=String(open);this.reveal.setAttribute('aria-expanded',String(open));

   this.querySelector('[data-reveal-label]').textContent=this.querySelector(open?'[data-close-copy]':'[data-open-copy]').textContent;

   this.querySelectorAll('.jl__gifts-stage').forEach(el=>{el.setAttribute('aria-hidden',String(!open));el.tabIndex=open?0:-1;});

   const scene=this.querySelector('[data-scene="'+this.selected+'"]');this.reveal.setAttribute('aria-controls',scene.querySelector('.jl__gifts-stage').id);this.reveal.hidden=Number(scene.dataset.gifts)===0;

  }

  select(index){if(!this.buttons[index])return;this.selected=index;this.buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));['scene','heading','buy'].forEach(key=>this.querySelectorAll('[data-'+key+']').forEach(el=>el.hidden=Number(el.dataset[key])!==index));this.placeReveal();this.setOpen(this.dataset.open==='true');this.querySelector('[data-scene="'+index+'"] .jl__gifts-stage').scrollLeft=0;}

  disconnectedCallback(){this.controller?.abort();this.controller=null;}

 });

}



