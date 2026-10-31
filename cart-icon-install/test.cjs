const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
let Element,frames=[],reduced=false,aborts=0;
const doc=new EventTarget();
class Base {
 constructor(){this.dataset={count:'0',motion:'true'};this.isConnected=true;this.states=[0,1,2,3].map(n=>({dataset:{jhcState:String(n)},hidden:false}));this.classes=new Set();this.classList={add:(s)=>this.classes.add(s),remove:(...ss)=>ss.forEach(s=>this.classes.delete(s))};this.counter={textContent:'0'};this.link={querySelector:()=>this.counter,setAttribute:(k,v)=>this.label=v};}
 closest(){return this.link}querySelectorAll(){return this.states}
}
vm.runInNewContext(fs.readFileSync(__dirname+'/theme/assets/june-happy-cart.js','utf8'),{HTMLElement:Base,customElements:{get:()=>false,define:(n,c)=>Element=c},document:doc,AbortController,MutationObserver:class{constructor(fn){this.fn=fn}observe(){}disconnect(){aborts++}},matchMedia:()=>({matches:reduced}),requestAnimationFrame:fn=>(frames.push(fn),frames.length),cancelAnimationFrame:()=>{},setTimeout:()=>1,clearTimeout:()=>{}});
const flush=()=>{while(frames.length){const f=frames;frames=[];f.forEach(fn=>fn())}};
const icon=new Element();icon.connectedCallback();
for(const [count,mood]of [[0,0],[1,1],[2,2],[3,2],[4,3],[20,3],[0,0]]){icon.setCount(count);flush();assert.equal(icon.dataset.mood,String(mood));assert.equal(icon.states.filter(s=>!s.hidden).length,1);assert.equal(icon.states.find(s=>!s.hidden).dataset.jhcState,String(mood));assert.match(icon.label,new RegExp('Cart, '+count));}
icon.setCount(1);icon.setCount(4);icon.setCount(0);flush();assert.equal(icon.dataset.mood,'0');assert(icon.classes.has('is-removing'));assert(!icon.classes.has('is-adding'));
reduced=true;icon.setCount(3);flush();assert.equal(icon.classes.size,0);reduced=false;
icon.dataset.motion='false';icon.setCount(4);flush();assert.equal(icon.classes.size,0);
icon.setCount(-1);icon.setCount(NaN);icon.setCount(1.5);assert.equal(icon.count,4);
const event=new Event('cart:count:update');event.detail={item_count:2};doc.dispatchEvent(event);assert.equal(icon.count,2);
icon.counter.textContent='7';icon.observer.fn();assert.equal(icon.count,7);
icon.counter.textContent='';icon.observer.fn();assert.equal(icon.count,7);
icon.disconnectedCallback();event.detail={item_count:9};doc.dispatchEvent(event);assert.equal(icon.count,7);assert.equal(aborts,1);
const header=fs.readFileSync(__dirname+'/theme/sections/my-header.liquid','utf8');
const schema=JSON.parse(header.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
const badge=schema.blocks.find(b=>b.type==='cart_badge_controls');assert.equal(badge.settings.filter(s=>s.id==='show_mobile').length,1);assert(badge.settings.some(s=>s.id==='june_happy_cart_motion'));assert.equal((header.match(/render 'june-happy-cart'/g)||[]).length,2);
console.log('PASS: 7 quantity cases; rapid superseding updates; reduced motion; motion toggle; invalid counts; native event; counter observation; listener cleanup; desktop/mobile render and existing badge controls.');
