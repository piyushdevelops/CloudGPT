const fs=require('fs');
const base=fs.readFileSync(process.argv[2]||'side-menu-oct09/before.liquid','utf8');
const style=fs.readFileSync('side-menu-oct09/drawer.liquid','utf8');
const settings=[{type:'header',content:'Side menu navigation typography'},
{type:'font_picker',id:'drawer_font',label:'Font family',default:'poppins_n6'},
{type:'range',id:'drawer_weight',label:'Font weight',min:400,max:900,step:100,default:600},
{type:'range',id:'drawer_size',label:'Desktop navigation size',min:12,max:20,step:1,unit:'px',default:15},
{type:'range',id:'drawer_size_mobile',label:'Mobile navigation size',min:12,max:20,step:1,unit:'px',default:14},
{type:'range',id:'drawer_tracking',label:'Letter spacing',min:-1,max:2,step:0.1,unit:'px',default:0},
{type:'range',id:'drawer_leading',label:'Line spacing',min:1,max:2,step:0.1,default:1.5}];
const marker='  "blocks": [';
if(base.includes('id="JuneDrawerStyles-'))throw Error('Already patched');
let result=base.replace('{% schema %}',style+'\n{% schema %}');
let at=result.indexOf(marker,result.indexOf('{% schema %}'))+marker.length;
result=result.slice(0,at)+'\n    '+JSON.stringify({type:'drawer_typography',name:'Side menu typography',limit:1,settings})+','+result.slice(at);
const presetAt=result.indexOf('"blocks": [',result.indexOf('"presets":'))+'"blocks": ['.length;
result=result.slice(0,presetAt)+'{"type":"drawer_typography"},'+result.slice(presetAt);
const a=result.indexOf('    <aside class="tjs-ph__drawer"');const z=result.indexOf('    </aside>',a);
let drawer=result.slice(a,z).replaceAll('<svg viewBox="0 0 12 8"','<svg width="16" height="16" viewBox="0 0 12 8"');
drawer=drawer.replace('aria-label="Mobile navigation"','aria-label="Shop navigation"');
result=result.slice(0,a)+drawer+result.slice(z);
result=result.replace('<aside class="tjs-ph__drawer"',"{% assign drawer_type = section.blocks | where: 'type', 'drawer_typography' | first %}\n    <aside {{ drawer_type.shopify_attributes }} class=\"tjs-ph__drawer\"");
fs.mkdirSync('side-menu-oct09/validation/sections',{recursive:true});fs.writeFileSync('side-menu-oct09/validation/sections/my-header.liquid',result);
console.log('Built',result.length,'characters');
