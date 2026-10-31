const fs=require('fs');
const path=require('path').join(__dirname,'app.js');
let s=fs.readFileSync(path,'utf8');
s=s.replace(":'Name'",":'Sample'");
s=s.replace("'<span class=\"pending-label\">CONTENT PENDING</span>'","'<span class=\"rating\" aria-label=\"Sample star layout, not a customer rating\">'+stars(5)+'</span>'");
fs.writeFileSync(path,s);
