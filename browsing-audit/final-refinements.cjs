const fs=require('fs');
const changes={
'june-layer-the-table': '@media(max-width:900px){.jt__products>[data-product]{display:grid;grid-template-columns:100px minmax(0,1fr);column-gap:14px;align-items:start}.jt__original{grid-column:1;grid-row:1/span 2;width:100px;height:110px;margin:0}.jt__product-name{grid-column:2;grid-row:1}.jt__price{grid-column:2;grid-row:2}.jt__products .jt__primary,.jt__products .jt__detail{grid-column:1/-1}.jt__products .jt__primary{margin-top:12px}}',
'june-with-extras': '@media(max-width:900px){.jl__product-heads{min-height:140px}}'
};
for(const [name,css]of Object.entries(changes)){const p=__dirname+'/theme/sections/'+name+'.liquid';let s=fs.readFileSync(p,'utf8');s=s.replace('{% endstylesheet %}',css+'\n{% endstylesheet %}');fs.writeFileSync(p,s)}
