const fs=require('fs');
const vm=require('vm');
const assert=require('node:assert/strict');
let Countdown;
let now;
class TestDate extends Date { static now(){return now;} }
const context={HTMLElement:class{},customElements:{get(){},define(name,type){Countdown=type;}},Date:TestDate,Intl,clearInterval(){}};
vm.runInNewContext(fs.readFileSync(__dirname+'/countdown.js','utf8'),context);
const launch=Date.parse('2026-10-26T17:00:00+05:30');
for(const [label,time,expired] of [['before',launch-1000,false],['exact',launch,true],['after',launch+1000,true]]) {
  now=time;
  const els={};
  for(const key of ['[data-grid]','[data-intro]','[data-date]','[data-complete]','[data-status]','[data-complete] p',...['days','hours','minutes','seconds'].map(u=>'[data-unit="'+u+'"]')])els[key]={hidden:key==='[data-complete]',textContent:key==='[data-complete] p'?'The preorder launch time has arrived.':''};
  const element=new Countdown();element.target=launch;element.dataset={motion:'false'};element.reduced={matches:true};element.querySelector=s=>els[s];element.tick();
  assert.equal(els['[data-complete]'].hidden,!expired);
  assert.equal(els['[data-grid]'].hidden,expired);
  assert.equal(els['[data-intro]'].hidden,expired);
  assert.match(els['[data-date]'].textContent,/26 October 2026.*5:00 pm IST/);
  console.log(label+': PASS; completion visible='+expired);
}
