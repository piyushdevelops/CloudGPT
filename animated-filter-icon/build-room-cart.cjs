const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'room-for-more');
fs.mkdirSync(target, {recursive:true});
let html = fs.readFileSync(path.join(__dirname,'happy-cart-soft/index.html'),'utf8');
const oldArt = JSON.parse(html.match(/const art=(\[.*\]);/)[1]);
const covers = [
  '',
  '<g class="contents"><rect x="10" y="4" width="9" height="15" rx="1.4" fill="#BFAEE9" stroke="#171717" stroke-width="1.3" transform="rotate(-8 14 14)"/><path d="m12 5 1.5 10" stroke="#171717" stroke-width="1.2"/></g>',
  '<g class="contents"><rect x="16" y="3" width="9" height="16" rx="1.4" fill="#f4f0e7" stroke="#171717" stroke-width="1.3" transform="rotate(10 20 14)"/><rect x="7" y="4" width="10" height="15" rx="1.4" fill="#BFAEE9" stroke="#171717" stroke-width="1.3" transform="rotate(-10 12 14)"/><path d="m10 5 1.5 10" stroke="#171717" stroke-width="1.2"/></g>',
  '<g class="contents"><rect x="16" y="3" width="10" height="16" rx="1.4" fill="#f4f0e7" stroke="#171717" stroke-width="1.3" transform="rotate(12 21 14)"/><rect x="6" y="3" width="11" height="16" rx="1.4" fill="#BFAEE9" stroke="#171717" stroke-width="1.3" transform="rotate(-12 12 14)"/><path d="m9 4 2 11" stroke="#171717" stroke-width="1.2"/></g>'
];
const fronts = [
 'M10 10h8q4 0 4.5 5l.5 11q.3 5-4 5H9q-4.3 0-4-5l.5-11Q6 10 10 10Z',
 'M9 10h9q4.5 0 5 5l.7 11q.3 5-4.5 5H8q-4.8 0-4.3-5l.8-11Q5 10 9 10Z',
 'M8 10h11q4.5 0 5 5l1 11q.5 5-5 5H7q-5 0-4.5-5l1-11Q4 10 8 10Z',
 'M7.5 10h12q4.5 0 5 5l1 10.5Q26 31 20 31H6.5Q1 31 1.5 25.5l1-10.5q.5-5 5-5Z'
];
const backs = [
 'M16 10h5q5 0 5.5 5l.5 11q.5 5-5 5h-6Z',
 'M16 10h6q5 0 5.5 5l.6 11q.5 5-5 5H16Z',
 'M16 10h7q5 0 5.5 5l.7 11q.5 5-5 5H16Z',
 'M16 10h8q5 0 5.5 5l1 10.5Q31 31 25 31h-9Z'
];
const art = fronts.map((front,i)=>'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 34" aria-hidden="true">'+covers[i]+'<g class="shell"><path d="'+backs[i]+'" fill="'+(i===3?'#BFAEE9':'#171717')+'"/><path d="'+front+'" fill="#929292"/><path d="M9 15c.5 5.5 8 5.5 8.5 0" fill="none" stroke="#171717" stroke-width="2.4" stroke-linecap="round"/></g></svg>');
oldArt.forEach((old,i)=>{html=html.split(old).join(art[i]);});
html=html.replace(/const art=\[.*\];/, 'const art='+JSON.stringify(art)+';');
const names=['Room for more','First little find','Coming together','A bag of good things'];
['A little hello','Happy to help','Getting excited','Absolutely delighted'].forEach((name,i)=>{html=html.split(name).join(names[i]);});
html=html.replace('June — soft happy bag','June — Option 2: Room for more').replace('JUNE / CART CHARACTER STUDY','OPTION 2 / ROOM FOR MORE').replace('A softer little character.','A bag that fills with joy.').replace('Your rounded bag reference, with a grey front and black side. Add items to reveal its happier expressions.','A familiar bag gradually fills out, with planner edges and a little lilac. Compare the four states below, or try the quantity controls.').replace('Tap an expression below to jump to that mood.','Tap a state below to compare its fullness.').replace('Preview only. Animation plays when quantity increases, then rests. Reduced-motion settings are respected.','Preview quantities only; the planner edges are symbolic, not a depiction of actual cart contents. Fullness stops growing at 4 items. Reduced-motion settings are respected.');
const css = '\n.happy-one,.happy-two,.happy-three{animation:receive .75s ease-in-out}.happy-three .bag-body{animation:none}.happy-one .contents,.happy-two .contents,.happy-three .contents{animation:arrive .65s ease-out;transform-box:view-box}.removing{animation:release .45s ease-out}@keyframes receive{0%,100%{transform:scale(1)}28%{transform:scale(1.035,.98)}56%{transform:scale(1.045,.955)}80%{transform:scale(.99,1.015)}}@keyframes arrive{0%{transform:translateY(-1.5px);opacity:.5}65%,100%{transform:translateY(0);opacity:1}}@keyframes release{0%{transform:scale(1.025,.99)}100%{transform:scale(1)}}@media(prefers-reduced-motion:reduce){.live,.live *{animation:none!important}}\n';
html=html.replace('</style>',css+'</style>');
html=html.replace('if(quantity>previous){','if(quantity<previous){document.querySelectorAll(\'.live\').forEach(el=>el.classList.add(\'removing\'));}if(quantity>previous){');
html=html.replace('<div class="eyebrow">','<p style="margin-bottom:18px"><a href="../happy-cart-soft/index.html" style="color:inherit">← Option 1: Happy Bag</a></p><div class="eyebrow">');
new Function(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
art.forEach((svg,i)=>fs.writeFileSync(path.join(target,'bag-'+i+'.svg'),svg));
fs.writeFileSync(path.join(target,'index.html'),html);
console.log('Option 2 saved separately: four states; script syntax valid.');
