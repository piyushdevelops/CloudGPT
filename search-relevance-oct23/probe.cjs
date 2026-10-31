const fs = require('fs');
(async()=>{
 const results=[];
 for(const q of ['zzqaunfindable','zzqaunfindable AND zzqaunfindable','planner','planner AND planner','planer','planer AND planer','mug','mug AND mug','gifts for mom','gifts AND for AND mom','qzxwplmnzz']) {
  const u=new URL('https://thejuneshop.com/search/suggest.json');
  u.searchParams.set('q',q);u.searchParams.set('resources[type]','product,query');u.searchParams.set('resources[limit]','10');u.searchParams.set('resources[limit_scope]','each');
  const r=await fetch(u),j=await r.json();
  const result={q,status:r.status,products:j.resources?.results?.products?.map(p=>({id:p.id,title:p.title})),queries:j.resources?.results?.queries};results.push(result);console.log(JSON.stringify(result));
 }
 fs.writeFileSync(__dirname+'/probe.json',JSON.stringify(results,null,2));
})();
