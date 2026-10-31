const fs=require('fs'),path=require('path'),{parse}=require('../tools/node_modules/jsonc-parser');
const root=path.join(__dirname,'theme'),before=JSON.parse(fs.readFileSync(path.join(__dirname,'before.json')));
let s=before.find(x=>x.filename==='sections/june-make-room.liquid').body.content;
function replace(a,b){if(!s.includes(a))throw Error('Missing anchor '+a.slice(0,70));s=s.replace(a,b)}
replace('  assign hero_id =',"  assign year_block = section.blocks | where: 'type', 'year_effect' | first\n  assign year_effect = year_block.settings\n  assign hero_id =");
replace('    --jh-mobile-nav:',`    --jh-year-colour: {% if year_effect.use_accent != false %}var(--jh-accent){% else %}{{ year_effect.colour | default: '#F56A28' }}{% endif %};
    --jh-year-stroke: {{ year_effect.outline_width | default: 2 }}px;
    --jh-year-shadow: {{ year_effect.shadow_blur | default: 18 }}px;
    --jh-mobile-nav:`);
replace('<div class="jh__year" aria-hidden="true">2027<span>{{ \'june_hero.labels.next_chapter\' | t }}</span></div>',`<div class="jh__year-wrap" {{ year_block.shopify_attributes }}>
        <div class="jh__year" aria-hidden="true" data-year-effect="{{ year_effect.style | default: 'fill' }}" data-enabled="{{ year_effect.enabled | default: true, allow_false: true }}" data-rate="{{ year_effect.blink_rate | default: 700 }}" data-speed="{{ year_effect.speed | default: 100 }}" data-start="{{ year_effect.start_delay | default: 600 }}" data-gap="{{ year_effect.digit_delay | default: 400 }}" data-repeat-gap="{{ year_effect.repeat_delay | default: 3000 }}" data-plays="{{ year_effect.plays | default: 1 }}" data-loop="{{ year_effect.loop | default: false }}" data-fade="{{ year_effect.fade | default: 20 }}" data-intensity="{{ year_effect.intensity | default: 100 }}">
          <div class="jh__year-digits">{% assign year_digits = '2,0,2,7' | split: ',' %}{% for digit in year_digits %}{% assign count_key = 'count_' | append: forloop.index %}{% assign default_count = forloop.index | plus: 1 %}<span class="jh__digit" data-blinks="{{ year_effect[count_key] | default: default_count }}">{{ digit }}<span class="jh__digit-flash">{{ digit }}</span></span>{% endfor %}</div>
          <span class="jh__year-caption">{{ 'june_hero.labels.next_chapter' | t }}</span>
        </div>
        <button type="button" class="jh__year-control" hidden data-pause-label="{{ 'june_hero.year_effect.pause' | t | escape }}" data-play-label="{{ 'june_hero.year_effect.resume' | t | escape }}" data-replay-label="{{ 'june_hero.year_effect.replay' | t | escape }}">{{ 'june_hero.year_effect.pause' | t }}</button>
      </div>`);
replace("{% assign life_image = block.settings.image | default: block.settings.collection.image %}","{% assign life_image = block.settings.image | default: block.settings.collection.image %}{% assign life_alt = block.settings.image_alt | default: block.settings.label %}");
replace("sizes: '90px', loading: 'lazy', alt: ''", "sizes: '90px', loading: 'lazy', alt: life_alt, class: 'jh__life-image' ");
replace('<a class="jh__life-item"','<a class="jh__life-item" style="--jh-life-fit:{{ block.settings.image_fit | default: \'cover\' }}"');
s=s.replaceAll('.jh__year span{','.jh__year-caption{');
const css=`
/* Undated remains the natural-height reference, including when another tab is active. */
.jh .jh__stage{position:relative}
.jh .jh__panel[data-panel=undated][hidden]{display:grid!important;visibility:hidden;pointer-events:none}
.jh .jh__panel:not([data-panel=undated]){position:absolute;inset:0;min-height:0!important;height:100%;overflow-y:auto;overscroll-behavior:auto;scrollbar-gutter:auto}
.jh .jh__life-image{object-fit:var(--jh-life-fit,cover)}
.jh .jh__year-wrap{grid-column:2;grid-row:1 / 3;min-width:0;align-self:center;text-align:center}
.jh .jh__year{font-size:clamp(100px,20vw,310px);margin:0;transform:none;letter-spacing:-.07em}
.jh .jh__year-digits{display:flex;justify-content:center;white-space:nowrap;line-height:1}
.jh .jh__digit{position:relative;display:inline-block;font:inherit;letter-spacing:inherit;margin:0}
.jh .jh__digit-flash{position:absolute;inset:0;display:block;font:inherit;letter-spacing:inherit;margin:0;opacity:0;color:var(--jh-year-colour);pointer-events:none}
.jh [data-year-effect=outline] .jh__digit-flash{color:transparent;-webkit-text-stroke:var(--jh-year-stroke) var(--jh-year-colour)}
.jh [data-year-effect=shadow] .jh__digit-flash{color:transparent;text-shadow:0 0 var(--jh-year-shadow) var(--jh-year-colour)}
.jh [data-year-effect=fill_shadow] .jh__digit-flash{text-shadow:0 0 var(--jh-year-shadow) var(--jh-year-colour)}
.jh .jh__year-control{font:inherit;font-size:12px;text-decoration:underline;text-underline-offset:4px;min-height:44px;margin-top:10px;padding:8px 12px;border:0;background:transparent;color:inherit;cursor:pointer}
.jh .jh__year-control[hidden]{display:none}
@media(max-width:749px){
 .jh .jh__panel[data-panel=undated][hidden]{display:flex!important}
 .jh .jh__year-wrap{order:-1;flex:none;align-self:stretch;margin:0 0 16px}
 .jh .jh__year{font-size:clamp(92px,28vw,160px)}
 .jh .jh__year-caption{margin-top:10px}
 .jh .jh__panel--dated{gap:0}
 .jh .jh__panel--dated .jh__alternate-title{font-size:min(8vw,38px)}
 .jh .jh__panel--dated .jh__form{margin-top:14px}
 .jh .jh__panel--dated .jh__year-control{margin-top:0}
 .jh .jh__panel--life{justify-content:center}
 .jh .jh__panel--life .jh__life-list{width:100%}
}
@media(prefers-reduced-motion:reduce){.jh .jh__digit-flash{opacity:0!important}.jh .jh__year-control{display:none!important}}
`;
replace('{% endstylesheet %}',css+'\n{% endstylesheet %}');
replace("if (this.ready) { document.addEventListener('shopify:block:select', this.editorHandler); this.setupTextSequence(); return; }", "if (this.ready) { document.addEventListener('shopify:block:select', this.editorHandler); this.setupTextSequence(); this.setupYearSequence(); return; }");
replace("this.editorHandler = event => { if (this.contains(event.target) && event.target.closest('.jh__life-item')) this.select('life'); };", "this.editorHandler = event => { if (!this.contains(event.target)) return; if (event.target.closest('.jh__life-item')) this.select('life'); if (event.target.closest('.jh__year-wrap')) this.select('dated'); };");
replace('      this.setupTextSequence();\n    }','      this.setupTextSequence();\n      this.setupYearSequence();\n    }');
replace('      this.stopTextSequence();\n    }','      this.stopTextSequence();\n      this.stopYearSequence();\n      this.yearObserver?.disconnect();\n      this.yearMedia?.removeEventListener(\'change\', this.yearMotionHandler);\n      document.removeEventListener(\'visibilitychange\', this.yearVisibilityHandler);\n      this.yearControl?.removeEventListener(\'click\', this.yearControlHandler);\n    }');
const js=fs.readFileSync(path.join(__dirname,'year-methods.js'),'utf8');
replace('    select(key) {',js+'\n    select(key) {');
replace('      this.panels.forEach(panel => { panel.hidden = panel.dataset.panel !== key; });',`      this.panels.forEach(panel => { const hidden = panel.dataset.panel !== key; panel.hidden = hidden; panel.inert = hidden; panel.setAttribute('aria-hidden', String(hidden)); });
      this.activeTab = key;
      if (this.year) { if (key === 'dated') { this.yearUserPaused = false; this.startYearSequence(); } else this.stopYearSequence(); }`);
let schemaMatch=s.match(/{% schema %}([\s\S]*?){% endschema %}/),schema=JSON.parse(schemaMatch[1]);
let life=schema.blocks.find(b=>b.type==='life_link');life.name='Journal image & link';life.settings.find(x=>x.id==='image').label='Journal image';life.settings.find(x=>x.id==='image').info='Choose or upload your own image. Leave blank to use the collection image.';life.settings.splice(3,0,{type:'text',id:'image_alt',label:'Image description',info:'Leave blank to use the journal label.'},{type:'select',id:'image_fit',label:'Image fit',default:'cover',options:[{value:'cover',label:'Fill thumbnail (crop)'},{value:'contain',label:'Show complete image'}]});
const range=(id,label,min,max,step,value,unit)=>({type:'range',id,label,min,max,step,default:value,...(unit?{unit}:{})});
const effect={type:'year_effect',name:'2027 digit effects',limit:1,settings:[
{type:'checkbox',id:'enabled',label:'Enable digit effect',default:true},
{type:'paragraph',content:'Runs left to right: first 2, then 0, second 2, then 7. Selecting this block opens the 2027 tab. Reduced-motion visitors see static numbers.'},
{type:'checkbox',id:'use_accent',label:'Use theme accent colour',default:true},{type:'color',id:'colour',label:'Custom effect colour',default:'#F56A28',info:'Used when Use theme accent colour is off.'},
{type:'select',id:'style',label:'Effect style',default:'fill',options:[{value:'fill',label:'Full number'},{value:'outline',label:'Outline only'},{value:'shadow',label:'Shadow / glow only'},{value:'fill_shadow',label:'Full number and glow'}]},
range('outline_width','Outline thickness',1,6,1,2,'px'),range('shadow_blur','Glow size',4,40,2,18,'px'),range('intensity','Effect strength',20,100,5,100,'%'),
{type:'header',content:'Blink counts'},range('count_1','First 2 — blinks',1,12,1,2),range('count_2','0 — blinks',1,12,1,3),range('count_3','Second 2 — blinks',1,12,1,4),range('count_4','7 — blinks',1,12,1,5),
{type:'header',content:'Timing'},range('blink_rate','Time per blink',400,2000,100,700,'ms'),range('speed','Overall speed',50,200,10,100,'%'),range('fade','Fade softness',0,40,5,20,'%'),range('start_delay','Delay before sequence',0,5000,100,600,'ms'),range('digit_delay','Pause between digits',0,3000,100,400,'ms'),
{type:'paragraph',content:'Higher speed is faster. Effective blink time never falls below 400 ms. Counts apply separately to each digit.'},
{type:'header',content:'Repeat'},range('plays','Sequence plays',1,10,1,1),{type:'checkbox',id:'loop',label:'Repeat continuously',default:false},range('repeat_delay','Pause between sequences',0,9000,500,3000,'ms')
]};schema.blocks.push(effect);schema.presets.forEach(p=>p.blocks.splice(1,0,{type:'year_effect'}));s=s.replace(schemaMatch[0],'{% schema %}\n'+JSON.stringify(schema,null,2)+'\n{% endschema %}');
fs.writeFileSync(path.join(root,'sections/june-make-room.liquid'),s);
let index=parse(before.find(x=>x.filename==='templates/index.json').body.content);let hero=Object.values(index.sections).find(x=>x.type==='june-make-room');hero.blocks.year_effect={type:'year_effect',settings:Object.fromEntries(effect.settings.filter(x=>x.id).map(x=>[x.id,x.default]))};hero.block_order.splice(1,0,'year_effect');fs.writeFileSync(path.join(root,'templates/index.json'),JSON.stringify(index,null,2)+'\n');
let locale=parse(before.find(x=>x.filename==='locales/en.default.json').body.content);locale.june_hero.year_effect={pause:'Pause effect',resume:'Resume effect',replay:'Replay effect'};fs.writeFileSync(path.join(root,'locales/en.default.json'),JSON.stringify(locale,null,2)+'\n');
fs.writeFileSync(path.join(__dirname,'changed.json'),JSON.stringify(['sections/june-make-room.liquid','templates/index.json','locales/en.default.json'],null,2));
console.log('Built hero controls');



