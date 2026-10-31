const fs = require('fs');
const path = require('path');
const source = path.join(__dirname, 'room-for-more');
const target = path.join(__dirname, 'happy-full-cart');
fs.mkdirSync(target, {recursive:true});
let html = fs.readFileSync(path.join(source,'index.html'),'utf8');
const old = JSON.parse(html.match(/const art=(\[.*\]);/)[1]);
const faces = [
 '',
 '<ellipse cx="9.5" cy="21.5" rx="1.05" ry="1.3"/><ellipse cx="17.5" cy="21.5" rx="1.05" ry="1.3"/><path d="M10.5 25c1.3 2.4 4.7 2.4 6 0" fill="none" stroke="#171717" stroke-width="1.7" stroke-linecap="round"/>',
 '<ellipse cx="9" cy="21" rx="1.1" ry="1.35"/><ellipse cx="18" cy="21" rx="1.1" ry="1.35"/><path d="M9.5 24.5c1.4 4.2 6.6 4.2 8 0" fill="none" stroke="#171717" stroke-width="1.8" stroke-linecap="round"/>',
 '<path d="M7.5 21.8c.5-2 2.8-2 3.3-.2m5.4 0c.5-1.8 2.8-1.8 3.3.2" fill="none" stroke="#171717" stroke-width="1.7" stroke-linecap="round"/><path d="M9.5 24.5q4 1.5 8 0c-.5 5.5-7.5 5.5-8 0Z"/>'
];
const art = old.map((svg,i)=>svg.replace('M9 15c.5 5.5 8 5.5 8.5 0','M9.5 12.5c.5 3.7 7.5 3.7 8 0').replace('stroke-width="2.4"','stroke-width="2"').replace('</svg>','<g class="expression" fill="#171717">'+faces[i]+'</g></svg>'));
old.forEach((svg,i)=>{html=html.split(svg).join(art[i]);});
html=html.replace(/const art=\[.*\];/,'const art='+JSON.stringify(art)+';');
html=html.replace('June — Option 2: Room for more','June — Happy + full').replace('OPTION 2 / ROOM FOR MORE','OPTIONS 1 + 2 / HAPPY + FULL').replace('A bag that fills with joy.','Fuller bag. Bigger smile.').replace('A familiar bag gradually fills out, with planner edges and a little lilac. Compare the four states below, or try the quantity controls.','The soft bag fills with planner edges and gets happier as items are added. Try the quantity controls, then compare the four states at 24px.');
html=html.replace('← Option 1: Happy Bag</a>','Option 1: Happy Bag</a> · <a href="../room-for-more/index.html" style="color:inherit">Option 2: Room for more</a>');
html=html.replace('First little find','First find, first smile').replaceAll('Coming together','Fuller and happier').replaceAll('A bag of good things','Full and delighted');
// Update the initial state names consistently in both HTML and script.
html=html.replaceAll('First little find','First find, first smile');
html=html.replace('Tap a state below to compare its fullness.','Tap a state below to compare fullness and expression.');
new Function(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
art.forEach((svg,i)=>fs.writeFileSync(path.join(target,'bag-'+i+'.svg'),svg));
fs.writeFileSync(path.join(target,'index.html'),html);
console.log('Combined preview saved separately; script syntax valid.');
