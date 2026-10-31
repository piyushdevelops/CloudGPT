import pathlib,re,json
for f in pathlib.Path('home-type-rollout/theme/sections').glob('*.liquid'):
 s=f.read_text(encoding='utf8')
 if f.name=='my-header.liquid':
  print(f.name, sorted(set(re.findall(r'class="([^"]+)"',s))))
 else:
  print(f.name, sorted(set(re.findall(r'class="([^"]+)"',s.split('{% stylesheet %}')[0]))))
