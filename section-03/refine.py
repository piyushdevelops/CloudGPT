from pathlib import Path
p=Path('section-03/theme/sections/june-with-extras.liquid')
s=p.read_text(encoding='utf-8')
s=s.replace('<span class="jl__plus" aria-hidden="true">+</span>', '<span class="jl__plus" aria-hidden="true"></span>')
start=s.index('.jl__editorial{')
end=s.index('@media(hover:hover)',start)
s=s[:start]+'''/* The complete catalog scene is contained, never cropped. */
.jl__editorial{min-width:0;padding:40px;background:color-mix(in srgb,var(--jl-accent) 9%,var(--jl-bg))}
.jl__header{padding:0 0 26px}.jl__heading{margin:14px 0 18px!important;overflow-wrap:break-word}.jl__label{text-transform:uppercase}
.jl__scenes{min-width:0;position:relative}.jl__scene{position:relative;display:flex;flex-direction:column;align-items:center;gap:16px}
.jl__scene picture{display:block;width:100%}.jl__scene img{width:100%;height:var(--jl-scene);object-fit:contain;object-position:center;border-radius:8px}
.jl__stamp{display:inline-flex;align-items:center;justify-content:center;text-align:center;padding:10px 20px;border:1px solid #1113;border-radius:999px;background:var(--jl-accent);color:#111;font-size:calc(var(--jl-label-size)*1.15)!important;letter-spacing:.08em!important}
.jl__shopping{min-width:0;padding:44px 40px;display:flex;flex-direction:column;justify-content:center}
.jl__caption{margin-top:10px!important}.jl__price{margin-top:14px!important}.jl__choose{margin-top:26px}
.jl__covers{display:grid;grid-template-columns:repeat(auto-fit,minmax(54px,1fr));gap:12px;margin:14px 0 24px}
.jl__cover{display:block;min-width:0;min-height:44px;border:1px solid #1113;padding:5px;background:color-mix(in srgb,var(--jl-accent) 6%,var(--jl-bg));border-radius:8px;transition:border-color var(--jl-duration) ease,transform var(--jl-duration) ease}
.jl__cover img{width:100%;height:112px;object-fit:contain;mix-blend-mode:multiply}
.jl__cover[aria-pressed=true]{border:2px solid var(--jl-ink);padding:4px;background:color-mix(in srgb,var(--jl-accent) 35%,var(--jl-bg));box-shadow:0 3px 0 var(--jl-ink)}
.jl__arrow{flex:none;width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;background:#111;color:var(--jl-accent);border-radius:50%}.jl__arrow svg{width:16px;height:16px}
.jl .jl__primary{display:inline-flex;align-items:center;justify-content:space-between;gap:44px;min-height:52px;padding:9px 10px 9px 24px;background:var(--jl-accent);color:#111;border:1px solid #111;border-radius:999px;box-shadow:-2px 1px 0 #111;transition:transform var(--jl-duration) ease}
.jl__primary .jl__arrow{width:32px;height:32px;transition:transform var(--jl-duration) ease}.jl__primary svg{width:18px;height:18px}
.jl__note{margin:12px 0 24px!important;opacity:.75}.jl__gifts{border-top:1px solid #1113}.jl__gifts summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:15px;min-height:60px;padding:16px 0}.jl__gifts summary::-webkit-details-marker{display:none}
.jl__plus{position:relative;display:block;width:16px;height:16px;flex:none}.jl__plus:before,.jl__plus:after{content:'';position:absolute;background:currentColor;left:0;top:7px;width:16px;height:2px}.jl__plus:after{transform:rotate(90deg)}.jl__gifts[open] .jl__plus:after{display:none}
.jl__gifts ol{display:grid;grid-template-columns:1fr 1fr;gap:10px;list-style:none;padding:0;margin:0}.jl__gifts li{display:flex;gap:10px;align-items:flex-start;padding:14px 12px;border-radius:8px;background:color-mix(in srgb,var(--jl-accent) 12%,var(--jl-bg))}.jl__gifts li:last-child:nth-child(odd){grid-column:1/-1}
.jl__number{display:grid;place-items:center;flex:none;width:28px;height:28px;border-radius:50%;background:color-mix(in srgb,var(--jl-accent) 65%,var(--jl-bg))}.jl__gift-note{display:block;font-size:.8em;margin-top:4px;opacity:.75}
.jl .jl__textlink{align-self:flex-start;display:inline-flex;align-items:center;gap:10px;min-height:44px;margin-top:24px;text-decoration:underline;text-underline-offset:5px}.jl__fallback{grid-column:1/-1;padding:20px}.jl__fallback a{display:inline-block;margin:8px;text-decoration:underline}.jl__empty{padding:40px;text-align:center}
''' + s[end:]
s=s.replace('grid-template-columns:minmax(0,1.45fr) minmax(340px,1fr)','grid-template-columns:minmax(0,1.2fr) minmax(340px,1fr)')
start=s.index('@media(min-width:901px)')
end=s.index('@media(prefers-reduced-motion:reduce)',start)
s=s[:start]+'''@media(min-width:901px) and (max-width:1150px){.jl__editorial,.jl__shopping{padding:30px 24px}.jl .jl__heading{font-size:calc(var(--jl-heading-size)*.85)}.jl__gifts ol{grid-template-columns:1fr}.jl__cover img{height:100px}}
@media(max-width:900px){
 june-limited.jl{display:block}.jl__editorial{padding:30px 20px 24px}.jl__header{padding:0 0 24px}
 .jl .jl__heading{font-size:var(--jl-heading-mobile)}.jl .jl__subheading{font-size:var(--jl-subheading-mobile)}.jl .jl__body{font-size:var(--jl-body-mobile)}.jl .jl__label{font-size:var(--jl-label-mobile)}.jl .jl__button{font-size:var(--jl-button-mobile)}
 .jl__heading{margin:12px 0 14px!important}.jl__scene img{height:var(--jl-mobile-scene);object-fit:contain}.jl__stamp{font-size:calc(var(--jl-label-mobile)*1.15)!important;padding:9px 18px}.jl__shopping{padding:28px 20px 30px}.jl__caption{margin-top:7px!important}.jl__price{margin-top:10px!important}.jl__choose{margin-top:22px}.jl__covers{gap:8px;margin:12px 0 22px}.jl__cover img{height:100px}.jl__gifts ol{grid-template-columns:1fr}.jl__note{margin-bottom:20px!important}.jl .jl__textlink{margin-top:18px}
}
''' + s[end:]
s=s.replace('Desktop minimum scene height','Desktop photo height (uncropped)').replace('Mobile scene height','Mobile photo height (uncropped)')
p.write_text(s,encoding='utf-8')
