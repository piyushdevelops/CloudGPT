const fs=require('fs'),path=require('path'),{parse}=require('jsonc-parser'),safe=require('postcss-safe-parser');
const dir=path.resolve(__dirname,'../master-palette'),root=path.join(dir,'theme');
const before=JSON.parse(fs.readFileSync(path.join(dir,'before.json')));
const defaults={bg:'#FFFFFF',surface:'#F5F5F3',ink:'#171717',muted:'#656565',accent:'#F56A28','on-accent':'#171717',border:'#DADADA',dark:'#171717','on-dark':'#FFFFFF'};
const labels={bg:'Page background and gutters',surface:'Secondary surfaces',ink:'Main text',muted:'Muted text',accent:'Primary accent and buttons','on-accent':'Button text',border:'Borders and dividers',dark:'Dark panels and footer','on-dark':'Text on dark panels'};
const presets={orange:defaults,blue:{...defaults,accent:'#2455F5','on-accent':'#FFFFFF'},red:{...defaults,accent:'#D82B32','on-accent':'#FFFFFF'},apricot:{bg:'#FAF7EF',surface:'#E7E1F0',ink:'#191816',muted:'#6B635D',accent:'#F5A477','on-accent':'#191816',border:'#D6CDC0',dark:'#241C18','on-dark':'#FAF7EF'}};
const semantic=/error|success|warning|sale|soldout|preorder|badge_|swatch|payment|rating/i;
const colourRe=/#(?:[\da-f]{8}|[\da-f]{6}|[\da-f]{4}|[\da-f]{3})\b/ig;
function role(key){if(semantic.test(key))return null;if(/muted|text2|foreground2/.test(key))return 'muted';if(/border|line_color|line_cl|^line$/.test(key))return 'border';if(/button.*(text|label)|cta.*text/.test(key))return 'on-accent';if(/accent|gold|yellow|button_accent|btnBClr|^button$/.test(key))return 'accent';if(/surface|paper.?2|background2|paper_alt/.test(key))return 'surface';if(/background|^paper$|^secClr$/.test(key))return 'bg';if(/ink|text_color|^text$|foreground|^priClr$/.test(key))return 'ink';if(/dark/.test(key))return 'dark';return null;}
function ref(r,fallback){return `var(--june-${r},${fallback})`;}
function css(source,file){let tokens=[];let masked=source.replace(/{{[\s\S]*?}}|{%[\s\S]*?%}/g,x=>{tokens.push(x);return 'LIQUIDTOKEN'+(tokens.length-1)+'END'});let ast=safe(masked);const footer=file.includes('june-footer');
 ast.walkDecls(d=>{let sel=d.parent.selector||'';if(semantic.test(sel)||/url\(/i.test(d.value))return;let prop=d.prop;
  d.value=d.value.replace(colourRe,h=>{let hex=h.slice(1);if(hex.length<5)hex=hex.split('').map(x=>x+x).join('');let base=hex.slice(0,6).toUpperCase(),alpha=hex.slice(6),r;
   if(base==='F56A28')r='accent';else if(base==='F5F5F3')r='surface';else if(base==='656565')r='muted';else if(base==='DADADA')r='border';else if(['171717','000000','111111'].includes(base))r=/shadow/.test(prop)?null:/background/.test(prop)?'dark':'ink';else if(base==='FFFFFF')r=/^(color|fill|stroke)$/.test(prop)?'on-dark':'bg';
   if(footer&&r==='ink')r='on-dark';if(footer&&r==='bg')r='dark';
   if(!r)return h;let value=ref(r,'#'+base);return alpha?`color-mix(in srgb,${value} ${Math.round(parseInt(alpha,16)/255*10000)/100}%,transparent)`:value;
  });
  // Existing Liquid colour controls become fallbacks when master colours are disabled.
  d.value=d.value.replace(/LIQUIDTOKEN(\d+)END/g,(m,i)=>{let t=tokens[+i],hit=t.match(/^{{-?\s*(?:section\.settings|typography|type|block\.settings)\.(\w+)(?:\s*\|\s*default:[\s\S]*?)?\s*-?}}$/);if(!hit)return m;let r=role(hit[1]);if(!r)return m;if(footer&&r==='bg')r='dark';if(footer&&r==='ink')r='on-dark';return ref(r,m)});
 });
 // Primary button labels must be independent from heading colour (blue/red presets need white).
 ast.walkRules(rule=>{if(!/(?:__primary\b|__button\b|[-_]btn\b|[-_]cta\b|add.to.cart|checkout.button)/i.test(rule.selector)||/before|after|arrow|secondary|outline|disabled|svg|span|circle/i.test(rule.selector))return;let bg=rule.nodes?.find(d=>d.type==='decl'&&/^background(?:-color)?$/.test(d.prop));if(bg&&(/accent|button/.test(bg.value)||bg.value.includes('--june-accent'))){let text=rule.nodes.find(d=>d.type==='decl'&&d.prop==='color');if(text)text.value=ref('on-accent',text.value);else rule.append({prop:'color',value:ref('on-accent','#171717')})}});
 ast.walkRules(rule=>{let bg=rule.nodes?.find(d=>d.type==='decl'&&/^background(?:-color)?$/.test(d.prop)),text=rule.nodes?.find(d=>d.type==='decl'&&d.prop==='color');if(bg&&/^var\(--[\w-]*accent(?:,.*)?\)$/.test(bg.value)&&text&&!text.value.includes('--june-on-accent')&&!/arrow|circle/.test(rule.selector))text.value=ref('on-accent',text.value);
  if(bg&&/^var\(--[\w-]*accent(?:,.*)?\)$/.test(bg.value)&&!text&&/__link/.test(rule.selector))rule.append({prop:'color',value:ref('on-accent','#171717')});
  if(/__arrow/.test(rule.selector)&&text&&bg&&/ink|dark/.test(bg.value)){bg.value=ref('dark',bg.value);text.value=ref('on-dark',text.value)}
  if(file.includes('june-make-room')&&/\.jh__mystery(?:\s*[:{,]|$)/.test(rule.selector)){if(bg)bg.value=ref('dark',bg.value);if(text)text.value=ref('on-dark',text.value)}
 });
 return ast.toString().replace(/LIQUIDTOKEN(\d+)END/g,(_,i)=>tokens[+i]);
}
function markup(s,file){return s.replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi,(_,a,b,c)=>a+css(b,file)+c).replace(/({%-?\s*(?:style|stylesheet)\s*-?%})([\s\S]*?)({%-?\s*end(?:style|stylesheet)\s*-?%})/g,(_,a,b,c)=>a+css(b,file)+c);}
function walk(o,file){if(Array.isArray(o)){o.forEach(x=>walk(x,file));return}if(!o||typeof o!=='object')return;for(const[k,v]of Object.entries(o)){if(typeof v==='string'&&/liquid|html|css/.test(k))o[k]=k==='custom_css'?css(v,file):markup(v,file);else if(typeof v==='object')walk(v,file)}}
let changed=[];
for(const n of before){if(!n.body.content)continue;let file=n.filename,s=n.body.content;if(file.startsWith('locales/')||file==='snippets/css-variables.liquid')continue;
 if(file.endsWith('.liquid')){s=markup(s,file);if(file.startsWith('sections/june-')){const hero=file.includes('june-make-room');s=s.replace(/({%\s*schema\s*%})([\s\S]*?)({%\s*endschema\s*%})/,(_,a,b,c)=>{let j=parse(b);let list=hero?j.blocks.find(b=>b.type==='typography').settings:j.settings;list.unshift({type:'checkbox',id:'use_master_palette',label:'Use master palette',default:true,info:'Uses Theme settings > June master palette. Turn off to use this section’s individual colours.'});return a+'\n'+JSON.stringify(j,null,2)+'\n'+c});
 s=(hero?`{% assign palette_controls = section.blocks | where: 'type', 'typography' | first %}\n`:'')+`{% if ${hero?'palette_controls.settings':'section.settings'}.use_master_palette == false %}\n{% style %}#shopify-section-{{ section.id }}{${Object.keys(defaults).map(r=>`--june-${r}:initial;`).join('')}}{% endstyle %}\n{% endif %}\n`+s;
 }
 if(file==='layout/theme.liquid')s=s.replace("render 'css-variables', is_rtl: is_rtl","render 'css-variables', is_rtl: is_rtl\n      render 'june-master-palette'");
 }else if(file.endsWith('.css'))s=css(s,file);
 else if(file.endsWith('.json')){let j=parse(s);walk(j,file);if(file==='config/settings_schema.json'){j.splice(1,0,{name:'June master palette',settings:[{type:'checkbox',id:'june_palette_enabled',label:'Enable master palette',default:true,info:'Controls theme colours. Photos, payment logos and app-controlled checkout retain their own colours.'},{type:'select',id:'june_palette_preset',label:'Palette preset',default:'orange',options:[{value:'orange',label:'20 — Vivid Orange (original)'},{value:'blue',label:'Electric Blue'},{value:'red',label:'Signal Red'},{value:'apricot',label:'Apricot & Lilac'},{value:'custom',label:'Custom colours'}]},{type:'paragraph',content:'Choose Custom colours to use the pickers below. Switching presets keeps your custom values saved. June sections can opt out using Use master palette.'},...Object.entries(defaults).map(([r,c])=>({type:'color',id:'june_palette_'+r.replaceAll('-','_'),label:labels[r],default:c}))]});}
 if(JSON.stringify(j)!==JSON.stringify(parse(s)))s=JSON.stringify(j,null,2)+'\n';}
 if(s!==n.body.content){let p=path.join(root,file);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,s);changed.push(file)}
}
let snippet=`{% doc %}\nCentral colour roles and presets for the June theme.\n@example\n{% render 'june-master-palette' %}\n{% enddoc %}\n{% if settings.june_palette_enabled %}\n{% liquid\n`;
for(const [r,c] of Object.entries(defaults))snippet+=`  assign jp_${r.replaceAll('-','_')} = settings.june_palette_${r.replaceAll('-','_')} | default: '${c}'\n`;
snippet+='  case settings.june_palette_preset\n';for(const[k,p]of Object.entries(presets)){snippet+=`    when '${k}'\n`;for(const[r,c]of Object.entries(p))snippet+=`      assign jp_${r.replaceAll('-','_')} = '${c}'\n`;}
snippet+=`  endcase\n%}\n{% style %}\n:root {\n`;
for(const r of Object.keys(defaults)){let v='jp_'+r.replaceAll('-','_');snippet+=` --june-${r}:{{ ${v} }};\n --june-${r}-rgb:{{ ${v} | color_to_rgb | remove: 'rgb(' | remove: ')' | replace: ',', ' ' }};\n`;}
snippet+=` --color-base-background:var(--june-bg-rgb); --color-base-text:var(--june-ink-rgb); --color-focus:var(--june-accent-rgb); --color-tooltip-background:var(--june-dark-rgb); --color-tooltip-text:var(--june-on-dark-rgb);\n}\n`;
snippet+=`{% for scheme in settings.color_schemes %}\n{% assign jp_brightness = scheme.settings.background | color_brightness %}\n[color-scheme="{{ scheme.id }}"] {\n`;
let schemeMap={background:'bg',background2:'surface',foreground:'ink',foreground2:'muted',accent:'accent',button:'accent','button-text':'on-accent','button-border':'ink','secondary-button':'bg','secondary-button-text':'ink',link:'ink','line-border':'border',overlay:'dark','pr-price':'ink','pr-text':'ink','input-primary':'bg','input-secondary':'ink',secondary:'muted',tertiary:'muted'};
for(const[k,r]of Object.entries(schemeMap)){let dr=['bg','surface'].includes(r)?'dark':['ink','muted'].includes(r)?'on-dark':r;snippet+=` --color-${k}:{% if jp_brightness < 70 %}var(--june-${dr}-rgb){% else %}var(--june-${r}-rgb){% endif %};\n`;}
snippet+=` --gradient-background:{% if jp_brightness < 70 %}var(--june-dark){% else %}var(--june-bg){% endif %};\n --payment-terms-background-color:rgb(var(--color-background));\n}\n{% endfor %}\n{% endstyle %}\n{% endif %}\n`;
fs.writeFileSync(path.join(root,'snippets/june-master-palette.liquid'),snippet);changed.push('snippets/june-master-palette.liquid');
fs.writeFileSync(path.join(dir,'changed.json'),JSON.stringify(changed,null,2));fs.writeFileSync(path.join(dir,'presets.json'),JSON.stringify(presets,null,2));console.log(changed);
