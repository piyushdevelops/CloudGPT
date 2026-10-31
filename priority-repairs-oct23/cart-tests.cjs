const vm=require('vm'),fs=require('fs'),assert=require('node:assert/strict');
let Cart, calls=0, release;
const context={customElements:{get:()=>null,define:(n,c)=>Cart=c},HTMLElement:class{},AbortController,URL,CustomEvent:class{},location:{pathname:'/cart',href:'https://test/cart'},window:{Shopify:{routes:{root:'/'}}},document:{querySelector:()=>null},fetch:async()=>{calls++;await new Promise(r=>release=r);return {ok:false,json:async()=>({description:'Stock changed. Please try again.'})}}};
vm.runInNewContext(fs.readFileSync(__dirname+'/candidate/assets/june-page-cart.js','utf8'),context);
(async()=>{
 const error={hidden:true},input={value:'9',defaultValue:'1',disabled:false},button={name:'plus',disabled:false};
 const cart=new Cart();cart.getAttribute=()=> 'main';cart.querySelector=()=>error;cart.querySelectorAll=()=>[input,button];cart.setAttribute=()=>{};cart.removeAttribute=()=>{};
 const row={dataset:{lineKey:'stable-key'},querySelectorAll:()=>[input]};
 const first=cart.change(row,9,button); await cart.change(row,10,button);
 assert.equal(calls,1,'in-flight update prevents duplicate requests');assert.equal(input.disabled,true);
 release();await first;assert.equal(input.value,'1');assert.equal(input.disabled,false);assert.equal(cart.busy,false);assert.equal(error.hidden,false);assert.equal(error.textContent,'Stock changed. Please try again.');
 const savings=(compare,original,qty)=>Math.max(0,(compare||original)-original)*qty;
 assert.equal(savings(99900,29900,2),140000);assert.equal(savings(null,29900,2),0);assert.equal(savings(19900,29900,2),0);
 console.log('PASS duplicate suppression, failed update restores input/unlocks controls, explicit error, sale/no-sale comparison arithmetic');
})().catch(e=>{console.error(e);process.exitCode=1});
