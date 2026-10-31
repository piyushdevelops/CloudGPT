





if(!customElements.get('june-glow')){

 customElements.define('june-glow',class extends HTMLElement{

  connectedCallback(){

   this.controller?.abort();this.controller=new AbortController();const options={signal:this.controller.signal};

   this.addEventListener('click',event=>{const b=event.target.closest('[data-select]');if(b&&this.contains(b))this.select(Number(b.dataset.select));},options);

   this.addEventListener('keydown',event=>{const b=event.target.closest('[data-select]');if(!b)return;const group=[...b.parentElement.querySelectorAll('[data-select]')];let i=group.indexOf(b),n;if(event.key==='ArrowRight')n=(i+1)%group.length;if(event.key==='ArrowLeft')n=(i-1+group.length)%group.length;if(event.key==='Home')n=0;if(event.key==='End')n=group.length-1;if(n===undefined)return;event.preventDefault();this.select(Number(group[n].dataset.select));group[n].focus();},options);

   this.addEventListener('shopify:block:select',event=>{const b=[...this.querySelectorAll('[data-block]')].find(b=>b.dataset.block===event.detail.blockId);if(b)this.select(Number(b.dataset.select));},options);

  }

  select(index){this.querySelectorAll('[data-select]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.select)===index)));this.querySelectorAll('[data-scene]').forEach(p=>p.hidden=Number(p.dataset.scene)!==index);this.querySelectorAll('[data-product]').forEach(p=>p.hidden=Number(p.dataset.product)!==index);}

  disconnectedCallback(){this.controller?.abort();}

 });

}





