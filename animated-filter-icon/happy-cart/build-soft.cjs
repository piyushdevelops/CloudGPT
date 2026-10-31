const fs = require('fs');
const path = require('path');
const source = __dirname;
const target = path.join(source, '../happy-cart-soft');
fs.mkdirSync(target, { recursive: true });
let html = fs.readFileSync(path.join(source, 'index.html'), 'utf8');
const old = JSON.parse(html.match(/const art=(\[.*\]);/)[1]);
const faces = [
  '',
  '<circle cx="9.5" cy="21" r="1.1"/><circle cx="19.5" cy="21" r="1.1"/><path d="M12 25q2.5 2 5 0" fill="none" stroke="#000" stroke-width="1.6" stroke-linecap="round"/>',
  '<circle cx="9.5" cy="20.5" r="1.1"/><circle cx="19.5" cy="20.5" r="1.1"/><path d="M11 24q3.5 5 7 0" fill="none" stroke="#000" stroke-width="1.8" stroke-linecap="round"/>',
  '<path d="M8 21q2-3 4 0m5 0q2-3 4 0" fill="none" stroke="#000" stroke-width="1.7" stroke-linecap="round"/><path d="M10.5 24h8q-.7 4-4 4t-4-4Z"/>'
];
const art = faces.map(face => '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 34" aria-hidden="true"><path fill="#000" d="M14 4h8q6 0 6.5 6l1 16q.5 6-6 6H13Z"/><path class="bag-body" fill="#929292" d="M10 4h7q5.5 0 6 6l1 16q.5 6-6 6H6.5q-6 0-5.5-6l1-16Q2.5 4 10 4Z"/><path d="M8.5 9.5c.5 5.5 8 5.5 8.5 0" fill="none" stroke="#000" stroke-width="2.4" stroke-linecap="round"/><g fill="#000">'+face+'</g></svg>');
for(let i=0;i<old.length;i++) html=html.split(old[i]).join(art[i]);
html=html.replace(/const art=\[.*\];/, 'const art='+JSON.stringify(art)+';');
html=html.replace('A happier little bag.', 'A softer little character.').replace('Add an item and watch its mood change. Four expressions, one familiar shape.', 'Your rounded bag reference, with a grey front and black side. Add items to reveal its happier expressions.').replace('0%,100%{fill:white}', '0%,100%{fill:#929292}');
html=html.replace('<title>June — a happier little bag</title>', '<title>June — soft happy bag</title>');
new Function(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
art.forEach((svg,i)=>fs.writeFileSync(path.join(target, 'bag-'+i+'.svg'),svg));
fs.writeFileSync(path.join(target, 'index.html'), html);
console.log('Four updated states, static comparisons and interactive preview saved. Script syntax valid.');
