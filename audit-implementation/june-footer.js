



if(!customElements.get('june-footer'))customElements.define('june-footer',class extends HTMLElement{

 connectedCallback(){this.controller?.abort();this.controller=new AbortController();const signal=this.controller.signal;this.media=matchMedia('(min-width:750px)');const sync=()=>this.querySelectorAll('.jfooter__group').forEach(g=>{g.open=this.media.matches;g.querySelector('summary').tabIndex=this.media.matches?-1:0;});sync();this.media.addEventListener('change',sync,{signal});this.addEventListener('click',e=>{const top=e.target.closest('[data-top]');if(top){e.preventDefault();window.scrollTo({top:0,behavior:this.dataset.motion==='true'&&!matchMedia('(prefers-reduced-motion:reduce)').matches?'smooth':'instant'});const target=[...document.querySelectorAll('h1')].find(el=>el.getClientRects().length&&!el.closest('[hidden],[inert]'))||document.querySelector('main')||document.body;const old=target.getAttribute('tabindex');target.setAttribute('tabindex','-1');target.focus({preventScroll:true});target.addEventListener('blur',()=>{if(old===null)target.removeAttribute('tabindex');else target.setAttribute('tabindex',old);},{once:true});}if(this.media.matches&&e.target.closest('.jfooter__group>summary'))e.preventDefault();},{signal});if(this.querySelector('.jfooter__form [role=status],.jfooter__form [role=alert]'))this.querySelector('.jfooter__newsletter').open=true;this.addEventListener('shopify:block:select',e=>{const d=e.target.closest('.jfooter__group');if(d)d.open=true;},{signal});}

 disconnectedCallback(){this.controller?.abort();}

});



