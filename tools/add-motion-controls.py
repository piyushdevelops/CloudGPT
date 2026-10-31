from pathlib import Path
import json
r=Path('/home/codespace/june-shop-redesign/section-01');s=(r/'before/motion-controls-sections-june-make-room.liquid').read_text()
s=s.replace('class="jh" aria-label=', '''class="jh" data-text-motion="{{ typography.motion_enabled | default: true, allow_false: true }}" data-motion-speed="{{ typography.motion_speed | default: 100 }}" data-motion-plays="{{ typography.motion_plays | default: 1 }}" data-motion-loop="{{ typography.motion_loop | default: false }}" data-motion-gap="{{ typography.motion_gap | default: 4 }}" aria-label=''',1)
s=s.replace('    setupTextSequence() {', '''    setupTextSequence() {
      this.motionSpeed = Math.max(.5, Math.min(2, Number(this.dataset.motionSpeed) / 100 || 1));
      this.motionPlays = this.dataset.motionLoop === 'true' ? Infinity : Math.max(1, Math.min(10, Number(this.dataset.motionPlays) || 1));
      this.motionGap = Math.max(1, Math.min(20, Number(this.dataset.motionGap) || 4)) * 1000;
      if (this.dataset.textMotion === 'false') return;''',1)
s=s.replace('      this.textAnimation?.cancel();', '''      this.textAnimation?.cancel();
      clearTimeout(this.repeatTimer);
      this.repeatResolve?.();
      this.repeatResolve = null;''',1)
s=s.replace("{ duration, delay, easing: 'ease-in-out', fill: 'none' }", "{ duration: duration / this.motionSpeed, delay: delay / this.motionSpeed, easing: 'ease-in-out', fill: 'none' }")
s=s.replace('''      try {
        await this.textStep''','''      try {
        for (let play = 0; play < this.motionPlays && !this.textStopped; play++) {
        await this.textStep''',1)
s=s.replace("        const glow = [", "        const accent = getComputedStyle(this).getPropertyValue('--jh-accent').trim() || '#d5ff46';\n        const glow = [",1)
s=s.replace("'rgba(213,255,70,0)'", "`color-mix(in srgb, ${accent} 0%, transparent)`").replace("'0 0 0 rgba(213,255,70,0)'", "`0 0 0 color-mix(in srgb, ${accent} 0%, transparent)`").replace("'rgba(213,255,70,.45)'", "`color-mix(in srgb, ${accent} 45%, transparent)`").replace("'0 0 12px rgba(213,255,70,.6)'", "`0 0 12px color-mix(in srgb, ${accent} 60%, transparent)`")
s=s.replace("        this.textObserver?.disconnect();", """        if (!this.textStopped && play + 1 < this.motionPlays) {
          await new Promise(resolve => { this.repeatResolve = resolve; this.repeatTimer = setTimeout(resolve, this.motionGap); });
          this.repeatResolve = null;
        }
        }
        this.textObserver?.disconnect();""",1)
a,b=s.split('{% schema %}');raw,end=b.split('{% endschema %}');d=json.loads(raw);typ=next(x for x in d['blocks'] if x['type']=='typography');accent=next(x for x in typ['settings'] if x.get('id')=='button_accent');accent['label']='Accent colour · buttons and glow';accent['info']='Any colour can replace the neon green. Applies to primary buttons, accent arrows and word glows.'
typ['settings'].extend([{'type':'header','content':'Text animation'},{'type':'checkbox','id':'motion_enabled','label':'Enable text animation','default':True},{'type':'range','id':'motion_speed','label':'Sequence speed','min':50,'max':200,'step':10,'default':100,'unit':'%','info':'100% is normal. 50% is slower; 200% is twice as fast.'},{'type':'range','id':'motion_plays','label':'Total plays','min':1,'max':10,'step':1,'default':1,'info':'1 plays once; 3 plays the sequence three times.'},{'type':'checkbox','id':'motion_loop','label':'Repeat continuously while visible','default':False,'info':'Overrides Total plays. Stops when the copy leaves view or another tab is selected.'},{'type':'range','id':'motion_gap','label':'Pause between repeats','min':1,'max':20,'step':1,'default':4,'unit':'s'}])
(r/'theme/sections/june-make-room.liquid').write_text(a+'{% schema %}\n'+json.dumps(d,indent=2)+'\n{% endschema %}'+end)
