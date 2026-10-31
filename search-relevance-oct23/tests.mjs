import assert from 'node:assert/strict';
import {keywordQuery,supportsTypedQuery,hasKeywordMatches} from './candidate/assets/june-search-matches.js';
globalThis.location={origin:'https://thejuneshop.com'};
const products=[{title:'Daily Planner',body:'<p>Rose gold binding for goals and habit tracking.</p>',tags:['stationery'],variants:[{sku:'PLAN-123'}]}];
assert.equal(supportsTypedQuery('planne',products),true);
assert.equal(supportsTypedQuery('planer',products),true);
assert.equal(supportsTypedQuery('plnaner',products),true);
assert.equal(supportsTypedQuery('habit tracking',products),true);
assert.equal(supportsTypedQuery('stationery',products),true);
assert.equal(supportsTypedQuery('zzqaunfindable',products),false);
assert.equal(supportsTypedQuery('zzqaunfindable planner',products),false);
assert.ok(keywordQuery('a"b').includes('a\\"b'));
assert.equal(keywordQuery('variants.sku:PLAN-123'),'variants.sku:PLAN-123');
const controller=new AbortController();controller.abort();
await assert.rejects(hasKeywordMatches('/search/suggest','mug',controller.signal),{name:'AbortError'});
const result=[];
for(const [query,expected] of [['zzqaunfindable',false],['xqzv987654321',false],['planner',true],['undated planner',true],['mug',true],['planer',true],['planne',true]]){
 const actual=await hasKeywordMatches('/search/suggest',query);assert.equal(actual,expected,query);result.push({query,matched:actual});
}
console.log(JSON.stringify({unit:'passed',live:result},null,2));
const realFetch=globalThis.fetch;
globalThis.fetch=async()=>({ok:false,status:503});
await assert.rejects(hasKeywordMatches('/search/suggest','failure-check-unique'),/unavailable/);
globalThis.fetch=realFetch;
console.log('Failed verification rejects rather than declaring no matches: passed');
