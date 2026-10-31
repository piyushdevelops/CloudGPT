from pathlib import Path

path = Path('photobook-studio-mvp/app.js')
source = path.read_text(encoding='utf-8')
changes = [
    (
        "button.firstChild.textContent='Saving photos securely… ';let handoff;try{handoff=await flushOrderAssets()}",
        "button.firstChild.textContent='Checking your book… ';let cartOption;try{cartOption=await resolveCartVariant()}catch(reason){console.error('Book option lookup failed',reason);error.textContent=reason?.message||'The photo book could not be found. Please try again.';error.hidden=false;button.disabled=false;button.firstChild.textContent='Try adding to bag again ';return}button.firstChild.textContent='Saving photos securely… ';let handoff;try{handoff=await flushOrderAssets()}",
    ),
    (
        'productHandle:state.productHandle,occasion:state.occasion,cover:state.cover',
        'productHandle:cartOption?.handle||state.productHandle,occasion:state.occasion,cover:state.cover',
    ),
    (
        "const params=new URLSearchParams(location.search),variant=params.get(`variant_${state.size.toLowerCase()}_${state.pages}`),store=params.get('shopify_store');if(variant&&store){",
        'if(cartOption){const {variant,store}=cartOption;',
    ),
]
for old, new in changes:
    count = source.count(old)
    if count != 1:
        raise SystemExit(f'Expected one match, found {count}: {old[:70]}')
    source = source.replace(old, new, 1)
path.write_text(source, encoding='utf-8')
