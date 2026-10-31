from PIL import Image,ImageDraw
from pathlib import Path
import json,urllib.request,io
p=Path('section-05'); data=json.loads((p/'product.json').read_text()); canvas=Image.new('RGB',(1200,900),'white'); draw=ImageDraw.Draw(canvas)
for j,n in enumerate(range(10,22)):
 url=data['images'][n]['url']+'&width=600'; im=Image.open(io.BytesIO(urllib.request.urlopen(url).read())).convert('RGB'); im.thumbnail((290,265)); x=(j%4)*300; y=(j//4)*300; canvas.paste(im,(x,y+25)); draw.text((x+10,y+5),str(n+1),fill='black')
canvas.save(p/'interiors.jpg')

