const fs=require('fs'),path=require('path');
const source=path.join(__dirname,'search-year-polished');
const target=path.join(__dirname,'search-year-playful');
fs.mkdirSync(target,{recursive:true});
let svg=fs.readFileSync(path.join(source,'search-year.svg'),'utf8');
svg=svg.replace('stroke-width="1.3"','stroke-width="1.65"').replace('x="16.8" y="5.45" width="5.25" height="8.25"','x="16.55" y="5.15" width="5.75" height="8.8"');
svg=svg.replace('transform="translate(11.9 6.3)"','class="year-colour" transform="translate(11.9 6.3)"').replace('class="reel"','class="reel year-colour"');
svg=svg.replace('stroke-width="3.7"','stroke-width="4.4"').replace('stroke-width="1.9"','stroke-width="2.65"');
svg=svg.replace('87%,92%{opacity:.85}100%{opacity:.35}','87%,92%{opacity:.55}100%{opacity:.08}');
svg=svg.replace('</style>',`
.year-colour{animation:year-ink 9s ease forwards}
.reel.year-colour{animation:year-roll 9s cubic-bezier(.22,.68,.25,1) forwards,year-ink 9s ease forwards}
.icon-pop{transform-box:view-box;transform-origin:17.8px 10px;animation:sticker-pop 9s linear forwards}
.sparkle{opacity:0;transform-box:view-box;transform-origin:29px 5px;animation:one-sparkle 9s ease forwards}
@keyframes year-ink{0%,84%{stroke:#17151B}90%,100%{stroke:#8C68C3}}
@keyframes sticker-pop{0%,83%,96%,100%{transform:scale(1)}85%{transform:scale(1.035,.96)}88%{transform:scale(.98,1.055)}92%{transform:scale(1.015,.99)}}
@keyframes one-sparkle{0%,86%{opacity:0;transform:scale(.25) rotate(-15deg)}90%{opacity:1;transform:scale(1) rotate(0)}95%,100%{opacity:0;transform:scale(.7) rotate(10deg)}}
@media(prefers-reduced-motion:reduce){.year-colour{animation:none;stroke:#8C68C3}.reel.year-colour{animation:none;transform:translateY(77px)}.icon-pop,.sparkle{animation:none}.sparkle{opacity:0}.lilac{opacity:.08}}
</style>`);
svg=svg.replace('</defs>','</defs>\n<g class="icon-pop">');
svg=svg.replace('</svg>','</g><path class="sparkle" d="m29 2 .7 2.3L32 5l-2.3.7L29 8l-.7-2.3L26 5l2.3-.7Z" fill="#BFAEE9" stroke="#17151B" stroke-width=".55" stroke-linejoin="round"/></svg>');
fs.writeFileSync(path.join(target,'search-year.svg'),svg);
let html=fs.readFileSync(path.join(source,'index.html'),'utf8');
html=html.replace('A clearer view of 2027.','2027, with a little attitude.').replace('A sculpted dark rim, a lilac handle and evenly drawn numerals. The last digit rolls down, pauses on 2026, then clicks softly into 2027.','Chunkier numerals, a bolder lilac grip and a little squash-and-pop on arrival. One sparkle marks 2027; the final 27 settles into a richer lilac.').replace('Local preview only.','<a href="../search-year-polished/index.html" style="margin:0">Compare the previous version</a><br>Local preview only.');
new Function(html.split('<script>')[1].split('</script>')[0]);
fs.writeFileSync(path.join(target,'index.html'),html);
console.log('Playful version created separately; preview script valid.');
