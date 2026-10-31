
if(!customElements.get('june-pour')){
 customElements.define('june-pour',class extends HTMLElement{
  connectedCallback(){
   this.controller?.abort();this.controller=new AbortController();const options={signal:this.controller.signal};
   this.buttons=[...this.querySelectorAll('[data-select]')];
   this.addEventListener('click',e=>{const b=e.target.closest('[data-select]');if(b&&this.contains(b))this.select(Number(b.dataset.select));},options);
   this.addEventListener('keydown',e=>{const b=e.target.closest('[data-select]');if(!b)return;let i=this.buttons.indexOf(b),n;
    if(e.key==='ArrowRight')n=(i+1)%this.buttons.length;if(e.key==='ArrowLeft')n=(i-1+this.buttons.length)%this.buttons.length;if(e.key==='Home')n=0;if(e.key==='End')n=this.buttons.length-1;
    if(n===undefined)return;e.preventDefault();this.select(n);this.buttons[n].focus();
   },options);
   this.addEventListener('shopify:block:select',e=>{const b=this.buttons.find(b=>b.dataset.block===e.detail.blockId);if(b)this.select(Number(b.dataset.select));},options);
  }
  select(index){if(!this.buttons[index])return;this.buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));['scene','product'].forEach(key=>this.querySelectorAll('[data-'+key+']').forEach(el=>el.hidden=Number(el.dataset[key])!==index));}
  disconnectedCallback(){this.controller?.abort();}
 });
}
