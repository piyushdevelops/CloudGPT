const fs=require('fs'),path=require('path');
let s=JSON.parse(fs.readFileSync(path.join(__dirname,'before.json')))[0].body.content;
function rep(a,b){if(!s.includes(a))throw Error('Missing '+a.slice(0,60));s=s.replace(a,b)}
rep('data-year-effect="', 'data-roll-duration="{{ year_effect.roll_duration | default: 1800 }}" data-roll-stagger="{{ year_effect.roll_stagger | default: 180 }}" data-roll-turns="{{ year_effect.roll_turns | default: 1 }}" data-highlight-duration="{{ year_effect.highlight_duration | default: 700 }}" data-year-effect="');
rep('>{{ digit }}<span class="jh__digit-flash">', '><span class="jh__digit-window"><span class="jh__digit-track"><span class="jh__digit-face">{{ digit }}</span></span></span><span class="jh__digit-flash">');
rep('{% endstylesheet %}', `.jh .jh__digit-window{display:block;height:1em;overflow:hidden;line-height:1}
.jh .jh__digit-track{display:block;will-change:transform}
.jh .jh__digit-face{display:block;height:1em;line-height:1;font:inherit;letter-spacing:inherit}
.jh .jh__digit{width:.68em;letter-spacing:0;font-variant-numeric:tabular-nums}
{% endstylesheet %}`);
rep('      if (!this.yearAnimation || this.yearDone) return;', '      if (this.yearDone) return;');
rep('      if (paused) this.yearAnimation.pause();\n      else this.yearAnimation.play();', '      for (const animation of [this.yearAnimation, ...(this.yearRollAnimations || [])].filter(Boolean)) { if (paused) animation.pause(); else animation.play(); }');
rep('      this.yearAnimation?.cancel();', '      this.yearAnimation?.cancel();\n      this.yearRollAnimations?.forEach(animation => animation.cancel());\n      this.yearRollAnimations = [];');
const start=s.indexOf('    async startYearSequence() {'),end=s.indexOf('    select(key) {',start);
s=s.slice(0,start)+`    async startYearSequence() {
      this.stopYearSequence();
      this.updateYearPlayback();
      if (this.year.dataset.enabled === 'false' || this.yearMedia.matches || this.activeTab !== 'dated') return;
      const run = this.yearRun;
      const number = (key, fallback) => Number.isFinite(Number(this.year.dataset[key])) ? Number(this.year.dataset[key]) : fallback;
      const speed = Math.max(.5, Math.min(2, number('speed', 100) / 100));
      const duration = Math.max(600, number('rollDuration', 1800) / speed);
      const stagger = number('rollStagger', 180) / speed;
      const turns = Math.max(1, Math.min(3, number('rollTurns', 1)));
      const digits = [...this.year.querySelectorAll('.jh__digit')];
      const plays = this.year.dataset.loop === 'true' ? Infinity : Math.max(1, Math.min(10, number('plays', 1)));
      const wait = ms => ms > 0 ? this.yearStep(this.year, [{opacity:1},{opacity:1}], ms / speed) : Promise.resolve();
      try {
        await wait(number('start', 600));
        for (let play = 0; play < plays && run === this.yearRun; play++) {
          this.year.dataset.sequencePlay = String(play + 1);
          this.yearRollAnimations = digits.map((digit, i) => {
            const track = digit.querySelector('.jh__digit-track');
            const target = Number(digit.querySelector('.jh__digit-flash').textContent);
            const steps = turns * 10;
            track.replaceChildren(...Array.from({length:steps + 1}, (_, n) => {
              const face = document.createElement('span');
              face.className = 'jh__digit-face';
              face.textContent = String((target + n) % 10);
              return face;
            }));
            return track.animate([{transform:'translateY(0)'},{transform:'translateY(-' + (steps * 100 / (steps + 1)) + '%)'}], {duration,delay:i * stagger,easing:'cubic-bezier(.18,.65,.2,1)',fill:'none'});
          });
          this.updateYearPlayback();
          await Promise.all(this.yearRollAnimations.map(animation => animation.finished));
          this.yearRollAnimations = [];
          if (run !== this.yearRun) return;
          const strength = Math.max(.2, Math.min(1, number('intensity', 100) / 100));
          this.yearRollAnimations = digits.map(digit => digit.querySelector('.jh__digit-flash').animate([{opacity:0},{opacity:strength,offset:.25},{opacity:strength,offset:.6},{opacity:0}], {duration:Math.max(300, number('highlightDuration',700) / speed),fill:'none',easing:'ease-in-out'}));
          this.updateYearPlayback();
          await Promise.all(this.yearRollAnimations.map(animation => animation.finished));
          this.yearRollAnimations = [];
          if (play + 1 < plays && run === this.yearRun) await wait(number('repeatGap', 3000));
        }
        if (run === this.yearRun) { this.yearDone = true; this.yearAnimation = null; this.updateYearPlayback(); }
      } catch (error) {
        if (error.name !== 'AbortError') console.error('June year effect:', error);
      }
    }
`+s.slice(end);
let m=s.match(/{% schema %}([\s\S]*?){% endschema %}/),schema=JSON.parse(m[1]),b=schema.blocks.find(x=>x.type==='year_effect');
b.name='2027 rolling year';
b.settings=b.settings.filter(x=>!['count_1','count_2','count_3','count_4','blink_rate','fade','digit_delay'].includes(x.id)&&x.type!=='paragraph'&&!(x.type==='header'&&x.content==='Blink counts'));
b.settings.find(x=>x.id==='style').label='Landing highlight style';
const range=(id,label,min,max,step,value,unit)=>({type:'range',id,label,min,max,step,default:value,...(unit?{unit}:{})});
b.settings.splice(1,0,{type:'paragraph',content:'Digits roll into 2027, then briefly highlight. Selecting this block opens the dated tab. Reduced-motion visitors see a static year.'},range('roll_duration','Roll duration',600,4000,100,1800,'ms'),range('roll_stagger','Delay between digit starts',0,600,20,180,'ms'),range('roll_turns','Digit revolutions',1,3,1,1),range('highlight_duration','Landing highlight duration',300,2000,100,700,'ms'));
s=s.replace(m[0],'{% schema %}\n'+JSON.stringify(schema,null,2)+'\n{% endschema %}');
const dest=path.join(__dirname,'theme/sections');fs.mkdirSync(dest,{recursive:true});fs.writeFileSync(path.join(dest,'june-make-room.liquid'),s);new Function(s.match(/{% javascript %}([\s\S]*?){% endjavascript %}/)[1]);console.log('Built and JS syntax passed');
