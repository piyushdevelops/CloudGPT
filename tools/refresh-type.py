from pathlib import Path
import json,re
r=Path('/home/codespace/june-shop-redesign/section-01');s=(r/'before/type-refresh-sections-june-make-room.liquid').read_text();a,b=s.split('{% schema %}');raw,end=b.split('{% endschema %}');d=json.loads(raw)
by={x.get('id'):x for x in d['settings']}
by['title_font']['default']='poppins_n9';by['heading']['default']='Make room.'
by['heading_size'].update(min=48,max=148,step=2,default=96,label='Desktop heading size')
by['heading_size_mobile'].update(min=32,max=92,step=2,default=64,label='Mobile heading size')
d['settings'].append({'type':'text','id':'subheading_emphasis','label':'Subheading words to bold','default':'big plans.'})
typ=next(x for x in d['blocks'] if x['type']=='typography')
defaults={'custom_text_font':True,'text_font':'poppins_n4','heading_weight':900,'heading_tracking':-4,'heading_leading':100,'subtitle_size':26,'subtitle_size_mobile':22,'subtitle_weight':400,'subtitle_tracking':-2,'subtitle_leading':135,'body_size':18,'body_size_mobile':16,'body_weight':400,'body_tracking':-1,'body_leading':150,'eyebrow_weight':500,'eyebrow_tracking':12,'button_size':14,'button_size_mobile':14,'button_weight':600,'button_tracking':-1,'button_leading':130,'nav_size':13,'nav_size_mobile':10,'nav_weight':500,'nav_tracking':-1}
for setting in typ['settings']:
 if setting.get('id') in defaults:setting['default']=defaults[setting['id']]
typ['settings'].extend([{'type':'header','content':'Buttons'},{'type':'color','id':'button_accent','label':'Button fill','default':'#d5ff46'}])
a=a.replace("  assign hero_id =", "  assign emphasis = section.settings.subheading_emphasis | escape\n  capture emphasis_markup\n    echo '<strong>'\n    echo emphasis\n    echo '</strong>'\n  endcapture\n  assign subtitle_copy = section.settings.subheading | escape | newline_to_br\n  if emphasis != blank\n    assign subtitle_copy = subtitle_copy | replace: emphasis, emphasis_markup\n  endif\n  assign hero_id =",1)
a=a.replace('{{ section.settings.subheading | escape | newline_to_br }}','{{ subtitle_copy }}',1)
a=a.replace('--jh-weight: {{ title_font.weight }};',"--jh-weight: {{ title_font.weight }};\n    --jh-accent: {{ typography.button_accent | default: '#d5ff46' }};")
a=a.replace("{{ typography.text_font | font_face: font_display: 'swap' }}", "{{ typography.text_font | font_face: font_display: 'swap' }}\n{% assign emphasis_font = typography.text_font | font_modify: 'weight', '700' %}{{ emphasis_font | font_face: font_display: 'swap' }}",1)
# Remove the old artificial scaling from the editable size calculation.
a=a.replace("clamp(24px, {{ section.settings.heading_size | times: 13.3 | divided_by: 140.0 }}vw, {{ section.settings.heading_size | times: 1.386 }}px)","clamp(32px, {{ section.settings.heading_size | divided_by: 14.4 }}vw, {{ section.settings.heading_size }}px)")
a=a.replace("{{ section.settings.heading_size | times: 76.0 | divided_by: 140.0 }}px", "{{ section.settings.heading_size | times: 0.65 }}px")
a=a.replace("clamp(24px, {{ section.settings.heading_size_mobile | times: 27.0 | divided_by: 88.0 }}vw, {{ section.settings.heading_size_mobile | times: 1.59 }}px)","clamp(28px, {{ section.settings.heading_size_mobile | divided_by: 3.9 }}vw, {{ section.settings.heading_size_mobile }}px)")
a=a.replace("{{ typography.heading_leading | divided_by: 100.0 | times: 0.93 }}", "{{ typography.heading_leading | divided_by: 100.0 }}")
a=a.replace("{{ section.settings.heading_size_mobile | times: 44.0 | divided_by: 88.0 }}px", "{{ section.settings.heading_size_mobile | times: 0.7 }}px")
arrow='<span class="jh__arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 12h14m-5-5 5 5-5 5"/></svg></span>'
a=a.replace('<span aria-hidden="true">↗</span>',arrow)
a=a.replace('{% endstylesheet %}', '''
.jh__title{font-size:96px;transform:none!important;letter-spacing:-.04em;white-space:normal;width:auto;max-width:5.5em;line-height:1;margin-left:0!important;text-wrap:balance}
.jh__alternate-title{transform:none;letter-spacing:-.04em;text-wrap:balance}
.jh__subtitle{max-width:470px}.jh__subtitle strong{font-weight:700}.jh__body{max-width:430px}
.jh__button{background:var(--jh-accent);color:var(--jh-ink)!important;border:1px solid var(--jh-ink);border-radius:999px;padding:7px 8px 7px 22px;min-height:50px;text-transform:none;gap:22px;box-shadow:-3px 0 0 var(--jh-ink),0 2px 0 #11111112}
.jh__button:hover{background:var(--jh-accent);filter:brightness(.96);box-shadow:-3px 0 0 var(--jh-ink),0 4px 9px #11111118}
.jh__button:active{box-shadow:-1px 0 0 var(--jh-ink);filter:brightness(.92)}
.jh__arrow{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;flex:0 0 32px;background:var(--jh-ink);color:var(--jh-accent);border-radius:50%}
.jh__arrow svg{width:18px;height:18px;transition:transform .18s}.jh__button:hover .jh__arrow svg,.jh__text-link:hover .jh__arrow svg{transform:translateX(2px)}
.jh__text-link{gap:10px;min-height:48px}.jh__text-link .jh__arrow{width:26px;height:26px;flex-basis:26px;color:var(--jh-bg)}
.jh__panel[data-panel=undated] .jh__actions{gap:20px}.jh__panel[data-panel=undated] .jh__copy{padding-top:16px}.jh__panel--scene[data-panel=undated]{padding-top:45px;padding-bottom:40px}.jh__eyebrow{margin-bottom:24px!important}
@media(max-width:749px){.jh__title{font-size:64px;max-width:5.2em;width:auto;transform:none!important;line-height:1}.jh__panel[data-panel=undated] .jh__copy{padding-top:0}.jh__panel--scene[data-panel=undated]{padding-top:28px;padding-bottom:22px}.jh__eyebrow{margin-bottom:18px!important}.jh__subtitle{margin-top:18px!important}.jh__body{margin-top:12px!important}.jh__panel[data-panel=undated] .jh__actions{gap:12px}.jh__actions .jh__button{justify-content:space-between;padding-left:22px}.jh__actions .jh__text-link{border:0;border-radius:0;background:none;box-shadow:none;text-decoration:underline!important;min-height:44px}.jh__panel--artwork[data-panel=undated] .jh__art{margin-top:18px}}
{% endstylesheet %}''',1)
(r/'theme/sections/june-make-room.liquid').write_text(a+'{% schema %}\n'+json.dumps(d,indent=2)+'\n{% endschema %}'+end)
s=(r/'before/type-refresh-templates-index.json').read_text();i=s.index('{');data=json.loads(s[i:]);sec=data['sections']['june_make_room'];sec['settings'].update(title_font='poppins_n9',heading='Make room.',heading_size=96,heading_size_mobile=64,subheading_emphasis='big plans.');sec['blocks']['typography']['settings'].update(defaults);sec['blocks']['typography']['settings']['button_accent']='#d5ff46';(r/'theme/templates/index.json').write_text(s[:i]+json.dumps(data,indent=2))
