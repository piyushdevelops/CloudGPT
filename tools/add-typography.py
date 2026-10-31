from pathlib import Path
import json
p=Path('/home/codespace/june-shop-redesign/section-01/theme/sections/june-make-room.liquid')
s=p.read_text();Path('/home/codespace/june-shop-redesign/section-01/before/june-make-room-before-typography.liquid').write_text(s)
a,b=s.split('{% schema %}');raw,end=b.split('{% endschema %}');schema=json.loads(raw)
settings=schema['settings'];old={x.get('id'):x for x in settings}
settings[:]=[x for x in settings if x.get('id') not in ['title_font','heading_size','heading_size_mobile']]
def header(t):return {'type':'header','content':t}
def range_(id,label,min,max,step,default,unit=None):
 d={'type':'range','id':id,'label':label,'min':min,'max':max,'step':step,'default':default}
 if unit:d['unit']=unit
 return d
settings.extend([header('Typography · Font families'),old['title_font'],{'type':'checkbox','id':'custom_text_font','label':'Use custom text font (otherwise Arial)','default':False},{'type':'font_picker','id':'text_font','label':'Text font','default':'assistant_n4'},{'type':'paragraph','content':'Display font applies to headings. Text font applies to descriptions, buttons and tabs. Weight availability depends on the selected font family.'}])
roles=[('heading','Headings',140,88,700,-5.5,100),('subtitle','Subheading',42,27,400,-3.5,113),('body','Supporting text',15,13,400,0,155),('eyebrow','Eyebrow',11,10,600,24,150),('button','Buttons and links',13,12,600,1,130),('nav','Tabs and navigation',14,11,400,0,130)]
selectors={'heading':'.jh__title, .jh__alternate-title, .jh__year','subtitle':'.jh__subtitle','body':'.jh__body, .jh__form, .jh__life-list','eyebrow':'.jh__eyebrow','button':'.jh__button, .jh__text-link','nav':'.jh__tab, .jh__mystery'}
css=[];fontload=[]
for role,label,desktop,mobile,weight,tracking,line in roles:
 settings.append(header('Typography · '+label))
 if role=='heading':
  settings.extend([old['heading_size'],old['heading_size_mobile']])
 else:
  settings.extend([range_(role+'_size','Desktop size',10,60,1,desktop,'px'),range_(role+'_size_mobile','Mobile size',10,60,1,mobile,'px')])
 settings.extend([range_(role+'_weight','Thickness (font weight)',100,900,100,weight),range_(role+'_tracking','Letter spacing',-8,30,.5,tracking,'%'),range_(role+'_leading','Line spacing',90,200,1,line,'%')])
 pref='#{{ hero_id }} '
 sel=', '.join(pref+x.strip() for x in selectors[role].split(','))
 css.append(sel+' { font-weight: {{ section.settings.'+role+'_weight }}; letter-spacing: {{ section.settings.'+role+'_tracking | divided_by: 100.0 }}em; line-height: {{ section.settings.'+role+'_leading | divided_by: 100.0 }}; }')
 if role!='heading':
  css.append(sel+' { font-size: {{ section.settings.'+role+'_size }}px; }')
  css.append('@media(max-width:749px) { '+sel+' { font-size: {{ section.settings.'+role+'_size_mobile }}px; } }')
  fontload.append("{% assign role_font = section.settings.text_font | font_modify: 'weight', section.settings."+role+"_weight %}{{ role_font | font_face: font_display: 'swap' }}")
css.extend(['#{{ hero_id }} { {% if section.settings.custom_text_font %}font-family: {{ section.settings.text_font.family }}, {{ section.settings.text_font.fallback_families }};{% endif %} }', '#{{ hero_id }} .jh__title { font-size: clamp(24px, {{ section.settings.heading_size | times: 13.3 | divided_by: 140.0 }}vw, {{ section.settings.heading_size | times: 1.386 }}px); }', '#{{ hero_id }} .jh__alternate-title { font-size: {{ section.settings.heading_size | times: 76.0 | divided_by: 140.0 }}px; }', '@media(max-width:749px) { #{{ hero_id }} .jh__title { font-size: clamp(24px, {{ section.settings.heading_size_mobile | times: 27.0 | divided_by: 88.0 }}vw, {{ section.settings.heading_size_mobile | times: 1.59 }}px); line-height: {{ section.settings.heading_leading | divided_by: 100.0 | times: 0.93 }}; } #{{ hero_id }} .jh__alternate-title { font-size: {{ section.settings.heading_size_mobile | times: 44.0 | divided_by: 88.0 }}px; } }'])
a=a.replace("  assign title_font = section.settings.title_font", "  assign title_font = section.settings.title_font | font_modify: 'weight', section.settings.heading_weight | default: section.settings.title_font")
a=a.replace('{% endstyle %}', '\n{% if section.settings.custom_text_font %}\n'+ '\n'.join(fontload)+'\n{% endif %}\n'+'\n'.join(css)+'\n{% endstyle %}',1)
p.write_text(a+'{% schema %}\n'+json.dumps(schema,indent=2)+'\n{% endschema %}'+end)
