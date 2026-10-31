
if(!customElements.get('june-table'))customElements.define('june-table',class extends HTMLElement{
 connectedCallback(){this.controller?.abort();this.controller=new AbortController();const o={signal:this.controller.signal};this.choices=[...this.querySelectorAll('.jt__choice')];
 this.addEventListener('click',e=>{const select=e.target.closest('[data-select]');if(select)this.select(Number(select.dataset.select));const mode=e.target.closest('[data-stack]');if(mode){this.dataset.stacked=mode.dataset.stack;this.querySelectorAll('[data-stack]').forEach(b=>b.setAttribute('aria-pressed',String(b===mode)));}},o);
 this.addEventListener('keydown',e=>{const b=e.target.closest('.jt__choice');if(!b)return;const i=this.choices.indexOf(b),n=this.choices.length;let next;if(e.key==='ArrowRight'||e.key==='ArrowDown')next=(i+1)%n;if(e.key==='ArrowLeft'||e.key==='ArrowUp')next=(i-1+n)%n;if(e.key==='Home')next=0;if(e.key==='End')next=n-1;if(next===undefined)return;e.preventDefault();this.select(next);this.choices[next].focus();},o);
 this.addEventListener('shopify:block:select',e=>{const b=this.choices.find(b=>b.dataset.block===e.detail.blockId);if(b)this.select(Number(b.dataset.select));},o);
 this.select(Math.min(this.choices.length-1,Math.max(0,Number(this.dataset.initial)||0)));
 }
 disconnectedCallback(){this.controller?.abort()}
 select(i){this.querySelectorAll('[data-select]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.select)===i)));this.querySelectorAll('[data-product]').forEach(p=>p.hidden=Number(p.dataset.product)!==i)}
});
