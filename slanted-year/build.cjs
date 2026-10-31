const fs=require('fs'),{parse}=require('../tools/node_modules/jsonc-parser');const before=JSON.parse(fs.readFileSync(__dirname+'/before.json'));let s=before.find(x=>x.filename==='sections/june-make-room.liquid').body.content;
function rep(a,b){if(!s.includes(a))throw Error('Missing '+a.slice(0,60));s=s.replace(a,b)}
rep('    --jh-year-stroke:',`    --jh-year-tilt: {{ year_effect.tilt | default: -6 }}deg;
    --jh-year-tilt-mobile: {{ year_effect.tilt_mobile | default: -4 }}deg;
    --jh-year-stroke:`);
rep('data-roll-duration="','data-landing-bounce="{{ year_effect.landing_bounce | default: 2 }}" data-roll-duration="');
rep('<span class="jh__year-caption">{{ \'june_hero.labels.next_chapter\' | t }}</span>', '<span class="jh__year-sticker">{{ \'june_hero.labels.coming_soon\' | t }}</span>');
rep("this.yearControl.textContent = this.yearDone ? this.yearControl.dataset.replayLabel : this.yearUserPaused ? this.yearControl.dataset.playLabel : this.yearControl.dataset.pauseLabel;",`const label = this.yearDone ? this.yearControl.dataset.replayLabel : this.yearUserPaused ? this.yearControl.dataset.playLabel : this.yearControl.dataset.pauseLabel;
      this.yearControl.textContent = this.yearDone ? '↻' : this.yearUserPaused ? '▶' : 'Ⅱ';
      this.yearControl.setAttribute('aria-label', label);
      this.yearControl.setAttribute('title', label);`);
rep("return track.animate([{transform:'translateY(0)'},{transform:'translateY(-' + (steps * 100 / (steps + 1)) + '%)'}], {duration,delay:i * stagger,easing:'cubic-bezier(.18,.65,.2,1)',fill:'none'});",`const finish = steps * 100 / (steps + 1);
            const bounce = Math.max(0, Math.min(4, number('landingBounce', 2))) / (steps + 1);
            return track.animate([{transform:'translateY(0)',offset:0,easing:'cubic-bezier(.18,.65,.2,1)'},{transform:'translateY(-' + (finish + bounce) + '%)',offset:.88,easing:'ease-out'},{transform:'translateY(-' + finish + '%)',offset:1}], {duration,delay:i * stagger,fill:'none'});`);
rep('{% endstylesheet %}',`.jh .jh__year-wrap{position:relative;padding:34px 14px 60px}
.jh .jh__year{position:relative;transform:rotate(var(--jh-year-tilt,-6deg));font-size:clamp(80px,34cqw,310px);filter:drop-shadow(0 10px 12px #00000008)}
.jh .jh__digit{width:.64em;flex:0 0 .64em}
.jh .jh__year-sticker{position:absolute;right:3%;bottom:-12px;transform:rotate(13deg);display:inline-flex;align-items:center;justify-content:center;padding:14px 22px;border:1.5px solid var(--jh-ink);border-radius:50%;background:var(--jh-accent);color:var(--june-on-accent,var(--jh-ink));font-family:inherit;font-size:clamp(11px,1.8cqw,15px);font-weight:700;line-height:1.2;letter-spacing:.08em;text-transform:uppercase;box-shadow:0 3px 0 var(--jh-ink);white-space:nowrap}
.jh .jh__year-control{position:absolute;right:16px;bottom:0;display:grid;place-items:center;width:44px;height:44px;min-height:44px;padding:0;margin:0;border:1px solid var(--june-border,#DADADA);border-radius:50%;text-decoration:none;font-size:22px;line-height:1;background:var(--jh-bg);color:var(--jh-ink)}
.jh .jh__year-control:hover{background:var(--june-surface,var(--jh-bg))}
.jh .jh__panel--dated .jh__form{margin-top:24px;max-width:480px}
.jh .jh__panel--dated .jh__form-row{gap:10px;align-items:stretch}
.jh .jh__panel--dated .jh__form input[type=email]{border-radius:8px;min-height:50px;background:var(--jh-bg)}
.jh .jh__panel--dated .jh__body{max-width:30em}
@media(max-width:749px){
 .jh .jh__year-wrap{padding:20px 8px 44px;margin:0 0 18px}
 .jh .jh__year{transform:rotate(var(--jh-year-tilt-mobile,-4deg));font-size:34cqw}
 .jh .jh__year-sticker{padding:9px 14px;right:2%;bottom:-15px;font-size:10px}
 .jh .jh__year-control{right:0;bottom:-5px;width:44px;height:44px;font-size:20px}
 .jh .jh__panel--dated .jh__form{margin-top:18px}
}
{% endstylesheet %}`);
const m=s.match(/{% schema %}([\s\S]*?){% endschema %}/),schema=JSON.parse(m[1]),effect=schema.blocks.find(b=>b.type==='year_effect');
effect.settings.push({type:'header',content:'Year composition'},...[[ 'tilt','Desktop tilt',-10,0,-6,'deg'],['tilt_mobile','Mobile tilt',-8,0,-4,'deg'],['landing_bounce','Landing bounce',0,4,2,'%']].map(([id,label,min,max,def,unit])=>({type:'range',id,label,min,max,step:1,default:def,unit})));
schema.settings.find(x=>x.id==='dated_heading').default='Your next year starts here.';
s=s.replace(m[0],'{% schema %}\n'+JSON.stringify(schema,null,2)+'\n{% endschema %}');
const index=parse(before.find(x=>x.filename==='templates/index.json').body.content);Object.values(index.sections).find(x=>x.type==='june-make-room').settings.dated_heading='Your next year starts here.';
const locale=parse(before.find(x=>x.filename==='locales/en.default.json').body.content);locale.june_hero.labels.launch_description='2027 dated planners. Get the first look.';
for(const [name,value] of [['sections/june-make-room.liquid',s],['templates/index.json',JSON.stringify(index,null,2)+'\n'],['locales/en.default.json',JSON.stringify(locale,null,2)+'\n']]){fs.mkdirSync(__dirname+'/theme/'+name.split('/')[0],{recursive:true});fs.writeFileSync(__dirname+'/theme/'+name,value)}
new Function(s.match(/{% javascript %}([\s\S]*?){% endjavascript %}/)[1]);console.log('Built; JS syntax passed');
