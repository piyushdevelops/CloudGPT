const fs=require('fs'),path=require('path');
const file=path.join(__dirname,'index.html');
let html=fs.readFileSync(file,'utf8');
if(!html.includes('secret-drawer.css'))html=html.replace('<style>','<link rel="stylesheet" href="secret-drawer.css?v=1"><style>');
html=html.replace('interactions.js?v=1','interactions.js?v=3');
html=html.replace('Return to the top to reopen it.','Return to the top to reopen it. Pull the black scoop down and release to find a little secret. On a keyboard, focus the wordmark and press ↓.');
fs.writeFileSync(file,html);
console.log('Secret drawer added to local prototype.');
