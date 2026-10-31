from pathlib import Path
root=Path(__file__).parent/'theme'/'sections'
markers={'june-layer-the-table':'/* Compact mobile','june-shop-the-corner':'/* Keep the real','june-with-extras':'/* iPhone follow-up','june-a-little-curious':' .jmystery__tier-arrow{display:none}'}
for name,marker in markers.items():
 p=root/(name+'.liquid');s=p.read_text(encoding='utf-8');a=s.index(marker);b=s.index('{% endstylesheet %}',a);block=s[a:b];s=s[:a]+s[b:];s=s.replace('{% schema %}','<style>\n'+block+'</style>\n{% schema %}',1);p.write_text(s,encoding='utf-8',newline='')
