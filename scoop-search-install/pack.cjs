const fs=require('fs'),path=require('path');
const files=['sections/my-header.liquid','sections/header-group.json','snippets/june-scoop-search.liquid','assets/june-scoop-search.js','assets/june-scoop-search.css'];
process.stdout.write(JSON.stringify(files.map(filename=>({filename,body:{type:'TEXT',value:fs.readFileSync(path.join(__dirname,'theme',filename),'utf8')}}))));
