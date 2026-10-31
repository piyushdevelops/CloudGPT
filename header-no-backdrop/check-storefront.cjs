const fs=require('fs');
(async()=>{
 let url='https://thejuneshop.com/?preview_theme_id=187527266499',cookies=new Map();
 for(let i=0;i<6;i++){
  const r=await fetch(url,{redirect:'manual',headers:{Cookie:[...cookies].map(([k,v])=>k+'='+v).join('; ')}});
  for(const c of r.headers.getSetCookie()){const first=c.split(';')[0],eq=first.indexOf('=');cookies.set(first.slice(0,eq),first.slice(eq+1));}
  if(r.status>=300&&r.status<400){url=new URL(r.headers.get('location'),url).href;continue;}
  const html=await r.text();fs.writeFileSync(__dirname+'/storefront.html',html);
  console.log(JSON.stringify({status:r.status,icons:(html.match(/<june-happy-cart /g)||[]).length,states:(html.match(/data-jhc-state=/g)||[]).length,script:html.includes('june-happy-cart.js'),liquidError:html.includes('Liquid error'),theme:(html.match(/Shopify.theme\s*=\s*([^;]+)/)||[])[1]}));break;
 }
})();
