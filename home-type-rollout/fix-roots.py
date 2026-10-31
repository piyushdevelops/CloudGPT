import pathlib,re
p=pathlib.Path(__file__).parent/'theme/sections'
for f in p.glob('june-*.liquid'):
 s=f.read_text(encoding='utf8')
 found=re.search(r'class="([a-z]+)({% if settings.june_type_enabled.*?{% endif %})',s)
 if not found:raise Exception(f.name)
 root,mark=found[1],found[2]
 s=s.replace(mark,'',1)
 s,n=re.subn(r'class="'+root+r'(?=[" ])',lambda m:m[0]+mark,s,count=1)
 assert n==1,f.name
 f.write_text(s,encoding='utf8')
