const fs=require('fs'),path=require('path');
const jsPath=path.join(__dirname,'interactions.js');
let js=fs.readFileSync(jsPath,'utf8');
js=js.replace('placeholder="Find your next favourite…"','placeholder="Find your next chapter"');
js=js.replace('</button></form><div class="results">','</button><button type="submit" class="search-go" aria-label="Search demo products"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg></button></form><div class="results" hidden>');
js=js.replace("if(mode==='search')return{w:Math.min(410,width-24),h:172,t:8,p:1}","if(mode==='search')return{w:Math.min(354,width-24),h:48,t:8,p:1}");
const from=js.indexOf(' function results(){');
const to=js.indexOf('\n search.onclick',from);
if(from<0||to<0)throw Error('Results function not found');
js=js.slice(0,from)+` function results(){const q=input.value.trim().toLowerCase(),node=wrap.querySelector('.results');node.replaceChildren();node.hidden=!q;if(!q)return;const result=document.createElement('button');result.type='button';result.className='suggestion';const title=document.createElement('strong'),detail=document.createElement('small'),arrow=document.createElement('span');title.textContent=q.includes('2027')?'The 2027 edit':'Undated planner';detail.textContent=q.includes('2027')?'Coming soon · preview only':'Add to demo bag';arrow.textContent=q.includes('2027')?'↗':'+';const copy=document.createElement('span');copy.append(title,detail);result.append(copy,arrow);result.onclick=()=>{if(q.includes('2027')){detail.textContent='Coming soon · no signup in this demo';return;}add();wrap.querySelector('.dismiss').focus({preventScroll:true});};node.append(result);}
`+js.slice(to);
fs.writeFileSync(jsPath,js);
const htmlPath=path.join(__dirname,'index.html');let html=fs.readFileSync(htmlPath,'utf8');
if(!html.includes('compact-search.css'))html=html.replace('<main>','<link rel="stylesheet" href="compact-search.css?v=1"><main>');
html=html.replace(/interactions\.js\?v=\d+/,'interactions.js?v=4');fs.writeFileSync(htmlPath,html);
console.log('Compact search applied.');
