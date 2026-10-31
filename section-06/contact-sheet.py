from PIL import Image,ImageDraw
from pathlib import Path
import json,urllib.request,io
p=Path('section-06');data=json.loads((p/'products.json').read_text());out=Image.new('RGB',(1400,900),'white');d=ImageDraw.Draw(out)
for row,product in enumerate(data):
 for n,item in enumerate(product['images'][:5]):
  im=Image.open(io.BytesIO(urllib.request.urlopen(item['url']+'&width=500').read())).convert('RGB');im.thumbnail((275,270));out.paste(im,(n*280,row*300+25));d.text((n*280+5,row*300+5),str(row)+' / '+str(n+1),fill='black')
out.save(p/'catalog.jpg')

