import json,base64
from pathlib import Path
import struct
root=Path('/home/codespace/.codex/generated_images/01a0d339-377f-7eb2-834e-e2ee07c37e45')
# Coordinates refer to the displayed reference boards; originals stay unchanged.
rows=[
('Make Room','002dddd8-01a7-48c1-ac35-22536444fe21',(1586,992),(10,26,1199,966),(1216,26,1573,966)),
('Undated + Top 3','d63e3be6-4ae1-43f4-a645-4e8fae799d7f',(1586,992),(13,13,1157,947),(1172,13,1573,947)),
('Limited Edition + Freebies','911b50fd-5a25-4ffd-9e52-5987cca1599e',(1586,992),(34,48,1184,954),(1204,48,1551,954)),
('2027 Coming Soon','67c6e410-3bc6-42fb-8ec9-679592c9b9c2',(1774,887),(42,122,1356,610),(1398,108,1732,739)),
('Inside Discovery','effec6c6-81de-42d0-bb2a-98502dea5cdf',(2048,768),(34,107,1552,702),(1586,105,2014,702)),
('Other Chapters · scroll states','071e0baa-f180-4593-af84-417e7e693fa2',(1536,1024),(22,155,507,449),(127,507,406,955)),
('Home Décor','6f0e590c-2d21-4845-b734-44e961b469d2',(1774,887),(38,162,1369,754),(1396,162,1736,754)),
('Lighting','c5e31b5c-e3a4-4557-81cb-43b88e610bff',(1944,809),(26,91,1501,739),(1523,91,1919,744)),
('Glassware','f91c9622-c624-40a8-b31c-c057a63330db',(1774,887),(36,102,1394,807),(1418,102,1742,807)),
('Kitchen & Dining · provisional','a4ed9176-c381-465d-ad6e-bdece88c4a96',(1838,856),(21,94,1411,794),(1439,94,1819,838)),
('Mystery Box','208ce169-d6d4-4bc2-b17d-7a7b1b1639a6',(1944,809),(34,107,1525,734),(1559,99,1907,738)),
('Footer','3a4d4edd-0302-413f-9682-842827a11c61',(1877,838),(44,144,1416,740),(1457,144,1835,738))]
data=[]
for title,id,wh,d,m in rows:
 p=root/('exec-'+id+'.png'); w,h=struct.unpack('>II',p.read_bytes()[16:24])
 def norm(c): return [c[0]/wh[0],c[1]/wh[1],(c[2]-c[0])/wh[0],(c[3]-c[1])/wh[1]]
 data.append(dict(title=title,w=w,h=h,src='data:image/png;base64,'+base64.b64encode(p.read_bytes()).decode(),d=norm(d),m=norm(m)))
data[5]['states']=[{'d':[22/1536,155/1024,485/1536,294/1024],'m':[127/1536,507/1024,279/1536,448/1024]}, {'d':[530/1536,155/1024,483/1536,294/1024],'m':[632/1536,507/1024,279/1536,448/1024]}, {'d':[1035/1536,155/1024,482/1536,294/1024],'m':[1132/1536,507/1024,279/1536,448/1024]}]
html='''<!doctype html><html><head><meta charset="utf-8"><title>The June Shop — complete homepage reference</title><style>
*{box-sizing:border-box}body{margin:0;background:#dedbd6;color:#222;font:15px Arial,sans-serif}header{padding:24px 32px;background:#faf8f3}h1{font-size:25px;margin:0 0 8px}p{margin:8px 0;line-height:1.5}button,a{font:inherit}button{padding:9px 16px;border:1px solid #999;background:#fff;cursor:pointer}button.active{background:#222;color:white}nav{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}.layout{display:flex;gap:28px;align-items:flex-start;max-width:1640px;margin:24px auto;padding:0 24px}.column{min-width:0;flex:1}.column.mobile{flex:0 0 350px}.page{background:#faf8f3;box-shadow:0 2px 16px #0001}.crop{position:relative;overflow:hidden;background-repeat:no-repeat}.section{border-bottom:1px solid #d8d3ca}.label{padding:8px 12px;background:#f2eee7;font:12px Arial;letter-spacing:.04em}.states{padding:10px;background:#f5eadf;display:flex;gap:5px;align-items:center;flex-wrap:wrap}.states span{font-size:12px;margin-right:4px}.states button{font-size:12px;padding:7px}.single .layout{display:block}.single .column{max-width:1440px;margin:auto}.single.mobileonly .column.mobile{width:390px;max-width:100%}.single.desktoponly .column.mobile,.single.mobileonly .column.desktop{display:none}body.clean .label{display:none}@media(max-width:800px){.layout{padding:0 10px;gap:12px}.column.mobile{flex-basis:30%}header{padding:20px}.states span{display:none}} @media print{header nav{display:none}}
</style></head><body><header><h1>The June Shop — complete homepage reference</h1><p>All 12 selected sections in order. Exact reference artwork assembled for review; product imagery and copy are illustrative.</p><p>Section 6 has three selectable story states in one space. Section 10 is provisionally locked. Image proportions are preserved; final responsive heights and motion are not implemented.</p><nav><button onclick="mode('both')">Side by side</button><button onclick="mode('desktop')">Desktop</button><button onclick="mode('mobile')">Mobile</button><button onclick="document.body.classList.toggle('clean')">Show / hide section labels</button></nav></header><main class="layout"><div class="column desktop"><h2>Desktop</h2><div class="page" id="desktop"></div></div><div class="column mobile"><h2>Mobile</h2><div class="page" id="mobile"></div></div></main><script>const data=DATA;
function paint(el,item,c){let[x,y,w,h]=c;el.style.aspectRatio=(item.w*w)+' / '+(item.h*h);el.style.backgroundImage='url('+item.src+')';el.style.backgroundSize=(100/w)+'% '+(100/h)+'%';el.style.backgroundPosition=(x/(1-w)*100)+'% '+(y/(1-h)*100)+'%';}
for(const [target,key] of [['desktop','d'],['mobile','m']])data.forEach((item,i)=>{const section=document.createElement('section');section.className='section';const label=document.createElement('div');label.className='label';label.textContent=String(i+1).padStart(2,'0')+' / '+item.title;section.append(label);const crop=document.createElement('div');crop.className='crop';crop.setAttribute('role','img');crop.setAttribute('aria-label',item.title+' '+target+' reference');paint(crop,item,item[key]);section.append(crop);if(item.states){const controls=document.createElement('div');controls.className='states';controls.innerHTML='<span>One section · view chapter:</span>';['Wedding','Rewritable','Baby'].forEach((name,j)=>{const b=document.createElement('button');b.textContent=name;if(!j)b.className='active';b.onclick=()=>{paint(crop,item,item.states[j][key]);controls.querySelectorAll('button').forEach(n=>n.classList.remove('active'));b.classList.add('active')};controls.append(b)});section.append(controls)}document.getElementById(target).append(section)});
function mode(m){document.body.className=m==='both'?'':'single '+(m==='desktop'?'desktoponly':'mobileonly')}
const q=new URLSearchParams(location.search);if(q.has('mode'))mode(q.get('mode'));if(q.has('clean'))document.body.classList.add('clean');
</script></body></html>'''.replace('DATA',json.dumps(data))
Path('/home/codespace/june-shop-redesign/review/homepage-reference.html').write_text(html)
print('Wrote self-contained reference',len(html))
