const fs=require('fs'),path=require('path');
const dir=__dirname;for(const sub of ['sections','assets'])fs.mkdirSync(path.join(dir,'theme',sub),{recursive:true});
let header=fs.readFileSync(path.join(dir,'before/sections/my-header.liquid'),'utf8');
header=header.replace('background:#faf7ff;border-radius:5px','background:transparent;border-radius:0');
header+=`\n{% style %}
/* Bare icon controls at rest, on scroll and on hover. Keep focus outlines. */
#TjsPremiumHeader-{{ section.id }}#TjsPremiumHeader-{{ section.id }} :is(.tjs-ph__mobile-top .tjs-ph__menu-toggle,.tjs-ph__mobile-search-toggle,.tjs-ph__icon-link,.tjs-ph__desktop-menu,.tjs-ph__search button[type="submit"]){background:transparent!important;border-color:transparent!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;color:var(--tjs-ph-text,#171717)!important}
#TjsPremiumHeader-{{ section.id }}#TjsPremiumHeader-{{ section.id }} :is(.tjs-ph__mobile-top .tjs-ph__menu-toggle,.tjs-ph__mobile-search-toggle,.tjs-ph__icon-link,.tjs-ph__desktop-menu,.tjs-ph__search button[type="submit"])::before,
#TjsPremiumHeader-{{ section.id }}#TjsPremiumHeader-{{ section.id }} :is(.tjs-ph__mobile-top .tjs-ph__menu-toggle,.tjs-ph__mobile-search-toggle,.tjs-ph__icon-link,.tjs-ph__desktop-menu,.tjs-ph__search button[type="submit"])::after{background:none!important;box-shadow:none!important;border-color:transparent!important}
#TjsPremiumHeader-{{ section.id }}#TjsPremiumHeader-{{ section.id }} img.tjs-ph__year-search{background:transparent!important;border-radius:0!important}
{% endstyle %}\n`;
let svg=fs.readFileSync(path.join(dir,'before/assets/june-search-year.svg'),'utf8');
if(!svg.includes('fill="url(#glass)"'))throw Error('Unexpected SVG lens');
svg=svg.replace('fill="url(#glass)"','fill="none"');
fs.writeFileSync(path.join(dir,'theme/sections/my-header.liquid'),header);fs.writeFileSync(path.join(dir,'theme/assets/june-search-year.svg'),svg);
JSON.parse(header.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
console.log('Removed icon backplates and opaque lens fill; schema unchanged.');
