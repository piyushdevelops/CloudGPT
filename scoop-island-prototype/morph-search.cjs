const fs=require('fs'),path=require('path');
const file=path.join(__dirname,'interactions.js');let js=fs.readFileSync(file,'utf8');
function replace(a,b){if(!js.includes(a))throw Error('Missing anchor: '+a.slice(0,80));js=js.replace(a,b);}
replace("const state={w:0,h:48,t:0,p:0},velocity={w:0,h:0,t:0,p:0}","const state={w:0,h:48,t:0,p:0,s:0},velocity={w:0,h:0,t:0,p:0,s:0}");
replace("const secret=document.createElement('div');",`const orb=document.createElementNS('http://www.w3.org/2000/svg','circle');orb.setAttribute('fill','#17151c');svg.append(orb);
 const secret=document.createElement('div');`);
const start=js.indexOf(' function paint(){'),end=js.indexOf('\n function step(',start);
if(start<0||end<0)throw Error('Missing paint');
js=js.slice(0,start)+` function paint(){
  const{w,h,t}=state,p=Math.max(0,Math.min(1,state.p)),s=Math.max(0,Math.min(1,state.s));
  const smooth=x=>x*x*(3-2*x),split=smooth(Math.max(0,(s-.2)/.8)),reveal=smooth(Math.max(0,(s-.45)/.55));
  const body=w-56*split,shoulder=mobile?22:42,r=Math.min(h/2,26),edge=2*shoulder*(1-p)+r*p;
  island.style.width=w+'px';island.style.height=h+'px';island.style.top=t+'px';
  island.style.setProperty('--search-reveal',reveal);island.style.setProperty('--search-shift',(1-reveal)*7+'px');
  island.style.setProperty('--search-body',body+'px');
  island.classList.toggle('search-morph',mode==='search'||s>.001);
  svg.setAttribute('viewBox',\x600 0 \x24{w} \x24{h}\x60);
  const k=.55228475,left=r*p,control=shoulder*(1-p)+r*(1-k)*p;
  path.setAttribute('d',\x60M\x24{left} 0 H\x24{body-left} C\x24{body-control} 0 \x24{body} \x24{r*(1-k)*p} \x24{body} \x24{h/2} C\x24{body} \x24{h-r*(1-k)*p} \x24{body-control} \x24{h} \x24{body-edge} \x24{h} H\x24{edge} C\x24{control} \x24{h} 0 \x24{h-r*(1-k)*p} 0 \x24{h/2} C0 \x24{r*(1-k)*p} \x24{control} 0 \x24{left} 0 Z\x60);
  orb.setAttribute('cx',w-24);orb.setAttribute('cy',h/2);orb.setAttribute('r',24*split);orb.style.opacity=split;
  home.style.opacity=String(Math.max(0,1-s*4));home.style.transform='translateY('+(-s*6)+'px)';
  if(mode==='home'||mode==='search')panel.hidden=mode!=='search'&&s<.001;
 }
`+js.slice(end);
replace('target=dimensions();','target={...dimensions(),s:mode===\'search\'?1:0};');
replace("home.hidden=next!=='home';panel.hidden=next!=='search';","home.hidden=next!=='home'&&next!=='search';panel.hidden=next!=='search'&&!(next==='home'&&state.s>.001);panel.inert=next!=='search';");
replace("if(next==='search')focusTimer=setTimeout(()=>input.focus({preventScroll:true}),reduced.matches?0:220);","if(next==='search')input.focus({preventScroll:true});");
fs.writeFileSync(file,js);
const htmlPath=path.join(__dirname,'index.html');let html=fs.readFileSync(htmlPath,'utf8');
html=html.replace('compact-search.css?v=1','compact-search.css?v=2').replace('interactions.js?v=4','interactions.js?v=5');
fs.writeFileSync(htmlPath,html);console.log('Continuous scoop/search geometry installed.');
