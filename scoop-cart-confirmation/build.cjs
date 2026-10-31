const fs=require('fs'),path=require('path'),root=__dirname;const read=p=>fs.readFileSync(path.join(root,p),'utf8');const write=(p,v)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),v);};
let h=read('before/sections/my-header.liquid');const block={type:'scoop_cart_notice',name:'Scoop cart confirmation',limit:1,settings:[{type:'checkbox',id:'enabled',label:'Show cart confirmation',default:true},{type:'text',id:'message',label:'Confirmation message',default:'Added to your bag'},{type:'text',id:'close_label',label:'Dismiss label',default:'Dismiss cart confirmation'},{type:'range',id:'hold',label:'Display duration',min:2,max:8,step:1,unit:'s',default:3},{type:'paragraph',content:'Size, colours and typography follow Scoop search. No separate sizing is needed.'}]};
const m=h.match(/{% schema %}([\s\S]*?){% endschema %}/);let s=m[1].replace(/"blocks"\s*:\s*\[/,'"blocks": [\n'+JSON.stringify(block,null,2)+',').replace(/("presets"\s*:\s*\[[\s\S]*?"blocks"\s*:\s*\[)/,'$1\n{"type":"scoop_cart_notice"},');h=h.replace(m[0],'{% schema %}'+s+'{% endschema %}');write('theme/sections/my-header.liquid',h);
const raw=read('before/sections/header-group.json'),idx=raw.indexOf('{'),g=JSON.parse(raw.slice(idx));const head=Object.values(g.sections).find(x=>x.type==='my-header');head.blocks.june_scoop_cart_notice={type:block.type,settings:{enabled:true,message:'Added to your bag',close_label:'Dismiss cart confirmation',hold:3}};head.block_order.push('june_scoop_cart_notice');write('theme/sections/header-group.json',raw.slice(0,idx)+JSON.stringify(g,null,2)+'\n');
let snippet=read('before/snippets/june-scoop-search.liquid');snippet=snippet.replace('{% assign s = block.settings %}',`{% assign s = block.settings %}
{% assign cart_notice = section.blocks | where: 'type', 'scoop_cart_notice' | first %}`);
snippet=snippet.replace('<template>',`<script type="application/json" data-cart-config>{"enabled":{{ cart_notice.settings.enabled | default: false, allow_false: true | json }},"message":{{ cart_notice.settings.message | default: 'Added to your bag' | json }},"close_label":{{ cart_notice.settings.close_label | default: 'Dismiss cart confirmation' | json }},"hold":{{ cart_notice.settings.hold | default: 3 | json }},"count":{{ cart.item_count | json }}}</script>
<template>`);write('theme/snippets/june-scoop-search.liquid',snippet);
let js=read('before/assets/june-scoop-search.js');js=js.replace('this.progress = 0;',`this.progress = 0;
      this.cartNotice=JSON.parse(this.querySelector('[data-cart-config]')?.textContent||'{}');
      this.cartCount=this.cartNotice.count||0;
      document.addEventListener('variant:add',e=>{if(!e.detail?.data?.didError)this.notifyCart();},{signal});
      document.addEventListener('cart:count:update',e=>{const count=e.detail?.item_count;if(!Number.isSafeInteger(count))return;const increased=count>this.cartCount;this.cartCount=count;if(increased)this.notifyCart();},{signal});`);
js=js.replace('    canOpen() {',`    notifyCart(){
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
    canOpen() {`);
js=js.replace('      if(this.active)return;\n      cancelAnimationFrame', '      if(this.active)return;\n      this.clearCart();\n      cancelAnimationFrame');
js=js.replace("if (this.active && e.key === 'Escape')", "if(this.toast && e.key==='Escape'){e.preventDefault();this.clearCart();return;}\n        if (this.active && e.key === 'Escape')");
js=js.replace('this.restoreFocus=false;}','this.restoreFocus=false;if(this.pendingCart){this.pendingCart=false;this.notifyCart();}}');
js=js.replace('disconnectedCallback(){this.controller?.abort();','disconnectedCallback(){this.clearCart();this.controller?.abort();');
write('theme/assets/june-scoop-search.js',js);
write('theme/assets/june-scoop-search.css',read('before/assets/june-scoop-search.css')+`
.jss-cart-notice{position:fixed;left:50%;transform:translateX(-50%);z-index:10021;display:flex;align-items:center;gap:10px;padding:0 14px;box-sizing:border-box;background:var(--jss-fill,#17151c);color:var(--jss-text);font:var(--jss-weight) var(--jss-size)/var(--jss-line) var(--jss-font);letter-spacing:var(--jss-tracking);box-shadow:0 5px 14px rgb(0 0 0 / var(--jss-shadow));animation:jss-cart-enter var(--jss-notice-duration) ease-out both}
.jss-cart-notice:before{content:'';position:absolute;inset:var(--jss-inset);border:var(--jss-rim) solid var(--jss-rim-color);border-radius:inherit;pointer-events:none}
.jss-cart-check{color:var(--jss-accent);font-size:20px;flex:none}
.jss-cart-message{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.jss-cart-close{width:32px;min-height:44px;padding:0!important;border:0!important;background:transparent!important;color:inherit!important;font:20px/1 sans-serif;cursor:pointer;flex:none}
.jss-cart-close:focus-visible{outline:2px solid var(--jss-accent);outline-offset:-3px}
@media(max-width:1149px){.jss-cart-notice{font-size:var(--jss-size-mobile)}}
@keyframes jss-cart-enter{from{opacity:0;translate:0 -6px}to{opacity:1;translate:0 0}}
`);
console.log('Cart confirmation shares search sizing.');
