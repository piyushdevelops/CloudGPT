import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=readFileSync('cart-motion-fix/global.min.js','utf8');
const start=src.indexOf('class CartDrawer extends DrawerComponent');
const end=src.indexOf('connectedCallback()',start);
let opens=0,closes=0,frames=[];
class DrawerComponent {constructor(){this.dialog={open:false}} async open(){opens++;this.dialog.open=true;await this.animateDialogOpen().finished} async close(){closes++;await this.animateDialogClose().finished;this.dialog.open=false}}
const animate=(d,f)=>{frames.push(f.transform);return {finished:Promise.resolve()}};
const Cart=new Function('DrawerComponent','animate','_matchMedia',src.slice(start,end)+'};return CartDrawer')(DrawerComponent,animate,()=>false);
const c=new Cart();
for(let i=0;i<5;i++){await Promise.all([c.open(),c.open(),c.open()]);assert.equal(c.dialog.open,true);await c.open();await Promise.all([c.close(),c.close()]);assert.equal(c.dialog.open,false)}
assert.equal(opens,5);assert.equal(closes,5);
for(let i=0;i<frames.length;i+=2){assert.equal(frames[i][1],'translate3d(0, 0, 0)');assert.equal(frames[i+1][1],'translate3d(100%, 0, 0)')}
console.log('PASS: 5 cycles, duplicate calls guarded, deterministic directions');

