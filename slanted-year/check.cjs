const fs=require('fs'),assert=require('assert');
const source=fs.readFileSync(__dirname+'/theme/sections/june-make-room.liquid','utf8');
const methods=source.slice(source.indexOf('    setupYearSequence()'),source.indexOf('    select(key)'));
const Sequence=new Function('document','return class {'+methods+'}')({createElement:()=>({})});
async function run(data={}){
 const calls=[],faces=[];const s=new Sequence();
 const digits=[2,0,2,7].map((n,i)=>{const track={replaceChildren(...children){faces[i]=children.map(x=>x.textContent)},animate(frames,options){calls.push({kind:'roll',i,frames,options});return{finished:Promise.resolve(),cancel(){}}}};const flash={textContent:String(n),animate(frames,options){calls.push({kind:'highlight',i,frames,options});return{finished:Promise.resolve(),cancel(){}}}};return{querySelector:q=>q.includes('track')?track:flash}});
 s.year={dataset:{enabled:'true',speed:'100',start:'0',plays:'1',...data},querySelectorAll:()=>digits};s.yearMedia={matches:false};s.activeTab='dated';s.isConnected=true;s.updateYearPlayback=()=>{};s.yearStep=async()=>{};
 await s.startYearSequence();return{calls,faces,done:s.yearDone};
}
(async()=>{const a=await run();assert.equal(a.done,true);assert.deepStrictEqual(a.calls.map(x=>x.kind),['roll','roll','roll','roll','highlight','highlight','highlight','highlight']);assert.deepStrictEqual(a.calls.slice(0,4).map(x=>x.options.delay),[0,180,360,540]);a.faces.forEach((f,i)=>{assert.equal(f.length,11);assert.equal(f[0],String([2,0,2,7][i]));assert.equal(f.at(-1),f[0]);});assert.equal((await run({plays:'2'})).calls.length,16);assert.equal((await run({enabled:'false'})).calls.length,0);console.log('PASS: stagger, target digits, landing highlight, repeat, disabled state');})();
