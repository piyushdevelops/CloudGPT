const fs=require('fs'),path=require('path'),{parse}=require('jsonc-parser'),postcss=require('postcss'),safe=require('postcss-safe-parser');
const dir=path.resolve(__dirname,'../palette-vivid-orange'),root=path.join(dir,'theme');
const P={white:'#FFFFFF',ink:'#171717',surface:'#F5F5F3',muted:'#656565',border:'#DADADA',accent:'#F56A28'};
const before=['before.json','extra-before.json','assets-before.json'].flatMap(f=>JSON.parse(fs.readFileSync(path.join(dir,f))).data.theme.files.nodes).filter(x=>x.body?.content!==undefined);
// Always work from the reconciled snapshot; this script is repeatable locally.
for(const n of before){let p=path.join(root,n.filename);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,n.body.content)}
const colourRe=/#(?:[\da-f]{8}|[\da-f]{6}|[\da-f]{4}|[\da-f]{3})\b/ig;
const semantic=/error|success|warning|sale|soldout|preorder|badge_|swatch|payment|rating/i;
function rgb(hex){let h=hex.slice(1);if(h.length<5)h=h.split('').map(x=>x+x).join('');return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16))}
function light(hex){return rgb(hex).reduce((a,b)=>a+b,0)/765}
function colour(key,old){if(semantic.test(key))return old;key=key.toLowerCase().replace(/^--tjs-/,'');if(/overlay|shadow/.test(key))return P.ink;if(/muted|secondary_text|text2/.test(key))return P.muted;if(/border|line_cl|line_color|^line/.test(key))return P.border;if(/button.*(text|label)|cta.*text/.test(key))return P.ink;if(/accent|decoration|gold|yellow|btnbclr|button_background|cta_background|timer_background|button_accent|^button$/.test(key))return P.accent;if(/paper_alt|paper-2|background2|surface|card_background/.test(key))return P.surface;if(/background|^paper$|^secclr$|input_primary|^white$/.test(key))return light(old)<.24?P.ink:P.white;if(/ink|text|foreground|^dark$|^pric|^price$|input_secondary|color_focus/.test(key))return light(old)>.76?P.white:P.ink;return old}
function neutralHex(h,prop,selector){let a=rgb(h),lum=light(h),chroma=Math.max(...a)-Math.min(...a),alpha=h.length===9?h.slice(-2):h.length===5?h.slice(-1).repeat(2):'';let out;
 if(/shadow|outline|border/.test(prop))out=lum<.25?P.ink:P.border;
 else if(prop==='color'||prop==='fill'||prop==='stroke')out=lum>.8&&chroma<35?P.white:lum<.35?P.ink:chroma>35?'currentColor':P.muted;
 else if(/background/.test(prop))out=lum<.22?P.ink:lum>.94?P.white:P.surface;
 else if(prop.startsWith('--'))out=colour(prop,h);
 else return h;
 return out==='currentColor'?out:out+alpha;
}
function css(source){let saved=[];let masked=source.replace(/{{[\s\S]*?}}|{%[\s\S]*?%}/g,x=>{let id='LIQUIDTOKEN'+saved.length;saved.push(x);return id});let ast=safe(masked);ast.walkDecls(d=>{if(semantic.test(d.parent.selector||'')||/url\(/i.test(d.value))return;let sel=d.parent.selector||'',prop=d.prop;d.value=d.value.replace(colourRe,h=>neutralHex(h,prop,sel));
  // Neutralise coloured translucent decoration without altering opacity.
  d.value=d.value.replace(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(\s*,\s*[\d.]+)?\s*\)/gi,(m,r,g,b,a='')=>{if(Math.max(+r,+g,+b)-Math.min(+r,+g,+b)<25)return m;return `rgb${a?'a':''}(23,23,23${a})`});
 });
 // Literal-colour actions in legacy custom Liquid keep a clear, readable orange fill.
 ast.walkRules(rule=>{if(!/(?:__primary|[-_]btn\b|[-_]cta\b|add.to.cart|checkout.button)/i.test(rule.selector)||/before|after|arrow|secondary|outline|disabled/i.test(rule.selector))return;let bg=rule.nodes?.find(d=>d.type==='decl'&&/^background(?:-color)?$/.test(d.prop));if(bg&&(/#[\da-f]{6}/i.test(bg.value)||/linear-gradient/.test(bg.value))){bg.value=P.accent;let text=rule.nodes.find(d=>d.type==='decl'&&d.prop==='color');if(text)text.value=P.ink;else rule.append({prop:'color',value:P.ink})}});
 return ast.toString().replace(/LIQUIDTOKEN(\d+)/g,(_,i)=>saved[+i]);}
function markup(s){s=s.replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi,(_,a,b,c)=>a+css(b)+c);s=s.replace(/({%\s*stylesheet\s*%})([\s\S]*?)({%\s*endstylesheet\s*%})/g,(_,a,b,c)=>a+css(b)+c);return s;}
function walk(o){if(Array.isArray(o)){o.forEach(walk);return}if(!o||typeof o!=='object')return;for(const[k,v]of Object.entries(o)){if(typeof v==='string'){if(/^#[\da-f]{3,8}$/i.test(v))o[k]=colour(k,v);else if(/liquid|custom_css|html|css/.test(k)){o[k]=k==='custom_css'? (Array.isArray(v)?v.map(css):css(v)):markup(v)}}else walk(v)}
 if(o.type==='color'&&typeof o.default==='string')o.default=colour(o.id||'',o.default);
 if(o.type==='color_background'&&o.default)o.default='';
}
function settingsSection(s){if(!s||!s.type)return;const t=s.type,a=s.settings??={};
 if(t.startsWith('june-')){a.background=t==='june-footer'?P.ink:P.white;if(t==='june-make-room'){a.text_color=P.ink;for(const b of Object.values(s.blocks||{}))if(b.type==='typography')b.settings.button_accent=P.accent;}else{a.ink=t==='june-footer'?P.white:P.ink;a.accent=P.accent;}if(t==='june-other-chapters')a.flower_secondary=P.border;}
 if(t==='my-header')Object.assign(a,{background:P.white,text_color:P.ink,muted_color:P.muted,accent:P.accent,border_color:P.border});
}
let changed=[];
for(const n of before){let file=n.filename,p=path.join(root,file),s=n.body.content;
 if(file.startsWith('locales/')||file==='snippets/css-variables.liquid')continue;
 if(file.endsWith('.json')){let j=parse(s);walk(j);for(const sec of Object.values(j.sections||{}))settingsSection(sec);
  if(file==='config/settings_data.json'){let c=j.current;Object.assign(c,{color_background:P.white,color_text:P.ink,color_focus:P.ink,tooltip_bg:P.ink,priClr:P.ink,secClr:P.white,btnBClr:P.accent,color_accent:P.ink});for(const scheme of Object.values(c.color_schemes||{})){let a=scheme.settings,dark=light(a.background)<.24;Object.assign(a,{background:dark?P.ink:P.white,background_gradient:'',background2:dark?P.ink:P.surface,text:dark?P.white:P.ink,text2:dark?P.border:P.muted,button:P.accent,button_label:P.ink,button_border:P.ink,secondary_button_label:dark?P.white:P.ink,accent_color:dark?P.white:P.ink,pr_text:dark?P.white:P.ink,price:dark?P.white:P.ink,line_border:dark?'#454545':P.border,input_primary:P.white,input_secondary:P.ink})}}
  let original=parse(s);if(JSON.stringify(j)!==JSON.stringify(original))s=JSON.stringify(j,null,2)+'\n';
 }else if(file.endsWith('.liquid')){s=markup(s);s=s.replace(/({%\s*schema\s*%})([\s\S]*?)({%\s*endschema\s*%})/g,(_,a,b,c)=>{let j=parse(b);walk(j);if(file.includes('/june-'))for(const setting of j.settings||[])if(setting.type==='color'){if(setting.id==='background')setting.default=file.includes('june-footer')?P.ink:P.white;if(setting.id==='ink'||setting.id==='text_color')setting.default=file.includes('june-footer')?P.white:P.ink;if(setting.id==='accent')setting.default=P.accent;if(setting.id==='flower_secondary')setting.default=P.border;}return a+'\n'+JSON.stringify(j,null,2)+'\n'+c});
  if(file==='layout/theme.liquid'){s=s.replace(/body\.template-index,\s*body\.template-index \.jcs \{ background-color: #[\da-f]+; \}/i,'body { background-color: #FFFFFF; }\n      body.template-index .jcs { background-color: #FFFFFF; }');}
  if(file.endsWith('june-find-your-glow.liquid'))s=s.replaceAll('#FFFFFF06','#17171706').replaceAll('#FFFFFF50','#17171730').replaceAll('#FFFFFF45','#17171730');
  if(file.endsWith('june-footer.liquid')){s=s.replaceAll('#17171744','#FFFFFF44').replaceAll('#17171788','#FFFFFF88');s=s.replace('.jfooter__brand>span{color:var(--jfooter-accent)}','.jfooter__brand>span{color:inherit}');}
 }else if(file.endsWith('.css'))s=css(s);
 if(s!==n.body.content){fs.writeFileSync(p,s);changed.push(file)}
}
fs.writeFileSync(path.join(dir,'changed.json'),JSON.stringify(changed,null,2));console.log(changed);console.log('Changed',changed.length);
