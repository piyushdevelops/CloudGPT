from pathlib import Path
p=Path('section-02/theme/sections/june-your-year.liquid')
s=p.read_text(encoding='utf-8')
Path('section-02/before/review-01.liquid').write_text(s,encoding='utf-8',newline='\n')
s=s.replace('gap:30px}.ju .ju__cover','gap:14px;max-width:1320px;margin:0 auto}.ju .ju__cover')
s=s.replace('height:var(--ju-stage);transform:scale(.86)','height:calc(var(--ju-stage)*1.12);transform:scale(.94)')
s=s.replace('gap:5px;padding:0 8px 20px','gap:7px;padding:10px 8px 22px')
s=s.replace('.ju__number{font-size:11px;font-weight:400}', '.ju__number{font-size:var(--ju-label-size);font-weight:var(--ju-label-weight)}')
s=s.replace('.ju__selected{font-size:10px;font-weight:500;visibility:hidden;min-height:18px}', '.ju__selected{font-size:var(--ju-button-size);font-weight:var(--ju-button-weight);visibility:hidden;min-height:30px;padding:6px 16px;border-radius:999px;background:var(--ju-accent);color:#111}')
s=s.replace('.ju__name{padding-bottom:8px;border-bottom:1px solid transparent}', '.ju__name{padding-bottom:4px;border-bottom:2px solid transparent}')
s=s.replace('top:42%;width:44px;height:44px','top:42%;width:52px;height:52px')
s=s.replace('grid-template-columns:1.12fr 1fr .9fr;align-items:center;gap:32px;padding:28px 48px','grid-template-columns:minmax(0,1.15fr) minmax(0,1fr) minmax(0,1fr);align-items:center;gap:24px;padding:32px 48px;max-width:1420px;margin:0 auto')
s=s.replace('.ju__preview{height:215px;min-width:0}', '.ju__preview{height:300px;min-width:0}')
s=s.replace('padding-left:30px;gap:10px','padding-left:24px;gap:12px')
s=s.replace('border-top:1px solid #1115}.ju__panel','border-top:1px solid #1113;background:color-mix(in srgb,var(--ju-accent) 7%,var(--ju-bg))}.ju__panel')
s=s.replace("sizes: '(min-width: 750px) 30vw, 45vw'", "sizes: '(min-width: 901px) 32vw, 90vw'")
pos=s.index('.ju[data-motion=false]')
s=s[:pos]+'''/* Review refinement: readable mobile preview and controls. */
@media(max-width:900px){
 .ju__track{max-width:none}.ju__cover-art{transform:scale(.9)}
 .ju__thumbs button{width:64px;height:70px;border-color:#1113;background:var(--ju-bg)}
 .ju__thumbs button[aria-pressed=true]{background:color-mix(in srgb,var(--ju-accent) 40%,var(--ju-bg));box-shadow:0 2px 0 #111}
 .ju__panel{grid-template-columns:1fr;gap:22px;padding:24px 20px}
 .ju__preview{height:280px}.ju__inside-copy{text-align:center}
 .ju__inside-copy .ju__label{font-size:var(--ju-label-mobile);letter-spacing:var(--ju-label-tracking)}
 .ju__inside-copy .ju__body{font-size:var(--ju-body-mobile);line-height:var(--ju-body-leading)}
 .ju__toggles{justify-content:center;font-size:var(--ju-button-mobile)!important;gap:24px;margin-top:12px}
 .ju__toggles button{min-height:44px}
 .ju__buy{border-top:1px solid #1113;padding-top:20px;gap:12px}
 .ju__buy>.ju__body{display:block}.ju .ju__primary{width:auto;gap:28px}
}
''' + s[pos:]
p.write_text(s,encoding='utf-8',newline='\n')
