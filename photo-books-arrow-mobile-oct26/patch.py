from pathlib import Path

path = Path("photo-books-arrow-mobile-oct26/remote-before/sections/june-photo-books-landing.liquid")
text = path.read_text(encoding="utf-8")
old = ".pbl__cards{display:flex;overflow:auto;margin-right:-18px}.pbl__cards a{flex:0 0 74vw}.pbl__steps ol"
new = ".pbl__story{padding-block:72px 58px}.pbl__cards{display:flex;overflow:auto;margin-right:-18px;scroll-snap-type:x mandatory;scroll-padding-left:0;overscroll-behavior-inline:contain}.pbl__cards a{flex:0 0 74vw;scroll-snap-align:start}.pbl__cards b{justify-content:flex-start;gap:10px;padding-right:8px}.pbl__card-arrow{width:32px;height:32px}.pbl__card-arrow svg{width:17px;height:17px}.pbl__steps ol"
if old not in text:
    raise SystemExit("Mobile target not found")
path.write_text(text.replace(old, new), encoding="utf-8")
