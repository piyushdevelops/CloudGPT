const fs=require('fs');const path=require('path');
const root=__dirname;const read=f=>fs.readFileSync(path.join(root,'before',f),'utf8');
let section=read('sections/cart-drawer.liquid');
section=section.replace("{% render 'june-cart-design', section: section %}","{% render 'june-cart-design', section: section %}\n{% render 'june-cart-preview', section: section %}");
const match=section.match(/{% schema %}([\s\S]*?){% endschema %}/);const schema=JSON.parse(match[1]);
schema.settings.push({type:'header',content:'Add-to-cart preview'},{type:'checkbox',id:'june_preview',label:'Show compact preview after adding',default:true},{type:'range',id:'june_preview_seconds',label:'Close after inactivity',min:3,max:15,step:1,unit:'s',default:5},{type:'range',id:'june_preview_width',label:'Desktop preview width',min:320,max:440,step:10,unit:'px',default:380},{type:'text',id:'june_preview_title',label:'Preview heading',default:'Added to your bag.'},{type:'text',id:'june_preview_full',label:'Full cart link',default:'View full cart'});
section=section.replace(match[0],'{% schema %}\n'+JSON.stringify(schema,null,2)+'\n{% endschema %}');
let scoop=read('assets/june-scoop-search.js');
scoop=scoop.replace('notifyCart(){','notifyCart(){\n      if(document.querySelector(\'june-cart-preview[data-enabled="true"]\'))return;');
for(const [file,content] of Object.entries({'sections/cart-drawer.liquid':section,'assets/june-scoop-search.js':scoop})){const dest=path.join(root,'theme',file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,content);}
