const assert=require('assert/strict'),vm=require('vm'),fs=require('fs');
let Countdown;vm.runInNewContext(fs.readFileSync('planner-launch-oct09/countdown.js','utf8'),{HTMLElement:class{},customElements:{get(){},define(name,cls){Countdown=cls;}},Date,Intl,clearInterval(){},setInterval(){return 1;}});
const target=Date.parse('2026-10-26T17:00:00+05:30');assert.equal(new Date(target).toISOString(),'2026-10-26T11:30:00.000Z');
let r=Countdown.remaining(target,target-90061000);assert.deepEqual(JSON.parse(JSON.stringify(r)),{days:1,hours:1,minutes:1,seconds:1,total:90061});
assert.equal(Countdown.remaining(target,target+10000).total,0);assert.equal(Countdown.remaining(target,target-1).seconds,1);assert.equal(Countdown.remaining(NaN,0),null);
const nodes=new Map();const c=new Countdown();c.querySelector=s=>{if(!nodes.has(s))nodes.set(s,{hidden:false,textContent:s==='[data-complete] p'?'Launch reached':''});return nodes.get(s);};c.target=Date.now()-1;c.tick();assert.equal(nodes.get('[data-grid]').hidden,true);assert.equal(nodes.get('[data-complete]').hidden,false);assert.equal(nodes.get('[data-status]').textContent,'Launch reached');
c.target=NaN;c.tick();assert.equal(nodes.get('[data-date]').textContent,'Launch date to be announced');
console.log('Passed: IST deadline, rollover, exact boundary, expired, invalid date, completion rendering.');
