const prompts={today:"What made everyone laugh today?",firsts:"What did they try for the very first time?",family:"Which family ritual feels most like home?"};
document.querySelectorAll('[data-prompt]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-prompt]').forEach(item=>item.classList.remove('is-active'));button.classList.add('is-active');document.querySelector('#prompt-text').textContent=prompts[button.dataset.prompt];}));
const dialog=document.querySelector('#sample-dialog');
document.querySelector('#open-sample').addEventListener('click',()=>dialog.showModal());
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
const commerceParams = new URLSearchParams(window.location.search);
const shopifyStore = (commerceParams.get('shopify_store') || '').replace(/\/$/, '');
const productUrl = commerceParams.get('product_url') || '/products/our-days';
document.querySelectorAll('.plan-cta').forEach(link => {
  const variantId = commerceParams.get(`variant_${link.dataset.plan}`);
  link.href = variantId && shopifyStore
    ? `${shopifyStore}/cart/add?id=${encodeURIComponent(variantId)}&quantity=1`
    : `${shopifyStore}${productUrl}`;
  link.target = '_top';
});

const spreads=[...document.querySelectorAll('[data-spread]')];
const spreadCurrent=document.querySelector('#spread-current');
let spreadIndex=0;
function showSpread(nextIndex,direction=1){
  const current=spreads[spreadIndex];
  spreadIndex=(nextIndex+spreads.length)%spreads.length;
  current.classList.add(direction>0?'is-turning-forward':'is-turning-back');
  window.setTimeout(()=>{
    current.classList.remove('is-active','is-turning-forward','is-turning-back');
    spreads[spreadIndex].classList.add('is-active');
    spreadCurrent.textContent=String(spreadIndex+1);
  },320);
}
document.querySelector('#next-spread').addEventListener('click',()=>showSpread(spreadIndex+1,1));
document.querySelector('#previous-spread').addEventListener('click',()=>showSpread(spreadIndex-1,-1));
