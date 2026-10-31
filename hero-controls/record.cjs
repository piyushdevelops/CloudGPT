const fs=require('fs');
const note='Latest hero controls (1 October 2026): Life Journals image controls clarified; all hero tabs share Undated’s height; 2027 digit effects block added with sequential 2/3/4/5 blinks, colour/style/timing/repeat controls and reduced-motion handling. Installed on unpublished 187527266499, checked desktop and 393x852. Read hero-controls/README.md. Nothing published.\n\n';
for(const f of ['AGENTS.md','START-HERE-LOCAL.md'])fs.writeFileSync(f,note+fs.readFileSync(f,'utf8'));
fs.writeFileSync('DECISIONS.md','## 1 October 2026 — Hero controls\n'+note+fs.readFileSync('DECISIONS.md','utf8'));
const j=JSON.parse(fs.readFileSync('WORKING-THEME.json','utf8'));j.heroControls={date:'2026-10-01',status:'Installed; awaiting user review',record:'hero-controls/README.md',verification:'hero-controls/remote-checks.json'};fs.writeFileSync('WORKING-THEME.json',JSON.stringify(j,null,2)+'\n');
