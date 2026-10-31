
if (!customElements.get('june-undated')) {
 customElements.define('june-undated', class extends HTMLElement {
  connectedCallback(){
   this.abort?.abort();this.abort=new AbortController();const options={signal:this.abort.signal};
   this.covers=[...this.querySelectorAll('.ju__cover')];this.panels=[...this.querySelectorAll('[data-panel]')];this.selected=Number(this.dataset.initial)||0;this.view='inside';
   this.addEventListener('click',e=>{const select=e.target.closest('[data-select]');const step=e.target.closest('[data-step]');const view=e.target.closest('[data-view]');if(select)this.select(Number(select.dataset.select));if(step)this.select(this.selected+Number(step.dataset.step));if(view){this.view=view.dataset.view;this.updateView();}if(e.target.closest('[data-compare]'))this.querySelector('.ju__dialog').showModal();if(e.target.closest('.ju__dialog [data-close]'))this.querySelector('.ju__dialog').close();},options);
   this.querySelector('.ju__dialog').addEventListener('click',e=>{if(e.target===e.currentTarget){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}},options);
   this.querySelector('.ju__track').addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();this.select(this.selected+(e.key==='ArrowLeft'?-1:1));this.covers[this.selected].focus({preventScroll:true});}},options);
   const track=this.querySelector('.ju__track');track.addEventListener('touchstart',e=>{this.touch=[e.touches[0].clientX,e.touches[0].clientY]}, {passive:true,...options});track.addEventListener('touchend',e=>{if(!this.touch)return;const dx=e.changedTouches[0].clientX-this.touch[0],dy=e.changedTouches[0].clientY-this.touch[1];if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.5)this.select(this.selected+(dx<0?1:-1));this.touch=null;},options);
   this.addEventListener('shopify:block:select',e=>{const target=e.target.closest('[data-select]');if(target)this.select(Number(target.dataset.select));},options);this.select(this.selected);
  }
  select(index){const n=this.covers.length;if(!n)return;this.selected=(index+n)%n;this.covers.forEach((cover,i)=>{let position=i-this.selected;if(position>n/2)position-=n;if(position<-n/2)position+=n;cover.style.setProperty('--ju-position',position);cover.classList.toggle('is-selected',i===this.selected);});this.querySelectorAll('[data-select]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.select)===this.selected)));this.panels.forEach((panel,i)=>panel.hidden=i!==this.selected);const status=this.querySelector('.ju__status');status.replaceChildren();const number=document.createElement('span');number.textContent=`0${this.selected+1} / 0${n}`;status.append(number,document.createTextNode(this.panels[this.selected].dataset.name));this.updateView();}
  updateView(){this.panels.forEach(panel=>{panel.querySelectorAll('[data-picture]').forEach(p=>p.hidden=p.dataset.picture!==this.view);panel.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===this.view)));});}
  disconnectedCallback(){this.abort?.abort();}
 });
}
