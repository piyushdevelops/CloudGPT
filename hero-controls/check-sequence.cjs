const fs=require('fs'),assert=require('assert');
const source=fs.readFileSync(__dirname+'/year-methods.js','utf8');
const Sequence=new Function('return class {'+source+'}')();
async function run(overrides={},counts=[2,3,4,5],cancel=false){
 const s=new Sequence(),steps=[];
 s.year={dataset:{enabled:'true',rate:'700',speed:'100',start:'600',gap:'400',repeatGap:'3000',plays:'1',loop:'false',fade:'20',intensity:'100',...overrides},querySelectorAll:()=>counts.map((n,i)=>({dataset:{blinks:String(n)},querySelector:()=>({digit:i+1})}))};
 s.yearMedia={matches:false};s.activeTab='dated';s.isConnected=true;s.updateYearPlayback=()=>{};
 s.yearStep=async(e,frames,duration,iterations=1)=>{steps.push({digit:e.digit||'delay',duration,iterations});if(cancel&&e.digit===2){const error=new Error('cancelled');error.name='AbortError';s.stopYearSequence();throw error}};
 await s.startYearSequence();return {steps,done:s.yearDone};
}
(async()=>{
 let a=await run();assert.deepStrictEqual(a.steps.filter(x=>x.digit!=='delay').map(x=>[x.digit,x.iterations]),[[1,2],[2,3],[3,4],[4,5]]);assert.equal(a.done,true);
 let b=await run({plays:'2',speed:'200',rate:'400'},[1,5,2,6]);assert.equal(b.steps.filter(x=>x.digit!=='delay').length,8);assert(b.steps.filter(x=>x.digit!=='delay').every(x=>x.duration===400));
 let c=await run({},[2,3,4,5],true);assert.deepStrictEqual(c.steps.filter(x=>x.digit!=='delay').map(x=>x.digit),[1,2]);assert.equal(c.done,false);
 let d=await run({enabled:'false'});assert.equal(d.steps.length,0);
 fs.writeFileSync(__dirname+'/sequence-checks.json',JSON.stringify({defaultOrderAndCounts:true,customCountsAndRepeat:true,rateFloor:true,cancelStopsRemainingDigits:true,disabledStatic:true},null,2));console.log('Sequence checks passed');
})();
