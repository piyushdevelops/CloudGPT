// Native broad search includes semantic suggestions. Use Shopify's own field
// search as evidence of keyword matches; never filter a catalogue by title.
const fields=['title','body','product_type','tag','vendor','variants.title','variants.sku','variants.barcode'];
const cache=new Map();
export function keywordQuery(query) {
  const terms=String(query).trim().match(/[^\s]+/gu)||[];
  if(!terms.length) return '';
  // Respect an intentional Shopify field query rather than treating its syntax as text.
  if(/(?:^|\s)(?:title|body|product_type|tag|vendor|variants\.(?:title|sku|barcode)):/.test(query)) return query;
  return terms.map(term=>{
    const value=term.replace(/\\/g,'\\\\').replace(/"/g,'\\"');
    return '('+fields.map(field=>field+':"'+value+'"').join(' OR ')+')';
  }).join(' AND ');
}
function oneEdit(a,b) {
  if(a===b) return true;
  if(Math.abs(a.length-b.length)>1) return false;
  if(a.length===b.length) {
    const differences=[];
    for(let i=0;i<a.length;i++) if(a[i]!==b[i]) differences.push(i);
    if(differences.length===1) return true;
    return differences.length===2 && differences[1]===differences[0]+1 && a[differences[0]]===b[differences[1]] && a[differences[1]]===b[differences[0]];
  }
  const shorter=a.length<b.length?a:b,longer=a.length<b.length?b:a;
  let i=0,j=0;
  while(i<shorter.length && j<longer.length) {if(shorter[i]===longer[j])i++;j++;if(j-i>1)return false;}
  return true;
}
const words=value=>(String(value||'').normalize('NFKC').toLowerCase().match(/[\p{L}\p{N}]+/gu)||[]);
export function supportsTypedQuery(query,products) {
  const terms=words(query);
  if(!terms.length) return false;
  return products.some(product=>{
    // Corroborate native typo/prefix matches across product metadata, never
    // discard individual products or attempt to rank/filter them by title.
    const body=String(product.body||'').replace(/<[^>]*>/g,' ');
    const text=[product.title,body,product.type,product.product_type,product.vendor,...(product.tags||[]),...(product.variants||[]).flatMap(v=>[v.title,v.sku,v.barcode])].join(' ');
    const tokens=[...new Set(words(text))];
    return terms.every((term,index)=>tokens.some(token=>token===term || (index===terms.length-1 && term.length>=2 && token.startsWith(term)) || (term.length>=4 && oneEdit(term,token))));
  });
}
export async function hasKeywordMatches(endpoint,query,signal,products) {
  const url=new URL(endpoint,location.origin);
  url.pathname=url.pathname.replace(/\.json$/,'')+'.json';
  url.search='';
  url.searchParams.set('q',keywordQuery(query));
  url.searchParams.set('resources[type]','product');
  url.searchParams.set('resources[limit]','1');
  // Existence is independent of availability filters and result ranking.
  url.searchParams.set('resources[options][unavailable_products]','show');
  const key=url.href;
  if(signal?.aborted) throw new DOMException('Aborted','AbortError');
  let matched=cache.get(key);
  if(matched===undefined) {
    const response=await fetch(url,{signal,headers:{Accept:'application/json'}});
    if(!response.ok) throw Error('Search match verification unavailable');
    const data=await response.json();
    if(!Array.isArray(data.resources?.results?.products)) throw Error('Invalid search response');
    matched=data.resources.results.products.length>0;
    if(cache.size>=60) cache.delete(cache.keys().next().value);
    cache.set(key,matched);
  }
  if(matched) return true;
  if(!products) {
    url.searchParams.set('q',query);url.searchParams.set('resources[limit]','10');
    const response=await fetch(url,{signal,headers:{Accept:'application/json'}});
    if(!response.ok) throw Error('Search suggestions unavailable');
    const data=await response.json();
    if(!Array.isArray(data.resources?.results?.products)) throw Error('Invalid search response');
    products=data.resources.results.products;
  }
  return supportsTypedQuery(query,products);
}
