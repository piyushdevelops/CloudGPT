from pathlib import Path
root=Path(r'reviews-both-oct26/photo-remote-before')
sec=root/'sections/june-photo-books-landing.liquid'
s=sec.read_text(encoding='utf-8')
markup=''' <section class="pbl__reviews"><div class="pbl__wrap"><div class="pbl__reviews-head"><div><p class="pbl__eye">BOOKS PEOPLE KEEP CLOSE</p><h2>Five stars. Full shelves.</h2></div><p>Launch review previews shown with the book in hand. Replace the sample wording with verified customer reviews as orders arrive.</p></div><div class="pbl__review-grid">{% for block in section.blocks %}{% if block.type == 'review' %}<article class="pbl__review" {{ block.shopify_attributes }}>{% if block.settings.image != blank %}{{ block.settings.image | image_url: width: 1200 | image_tag: loading: 'lazy', widths: '420, 720, 960, 1200', sizes: '(max-width: 749px) 82vw, 33vw', alt: block.settings.title }}{% elsif block.settings.asset != blank %}<img src="{{ block.settings.asset | asset_url }}" alt="{{ block.settings.title | escape }}" loading="lazy" width="900" height="720">{% endif %}<div class="pbl__review-copy"><div class="pbl__stars" role="img" aria-label="{{ block.settings.rating }} out of 5 stars">{% for star in (1..5) %}<span{% if star > block.settings.rating %} class="is-empty"{% endif %}>★</span>{% endfor %}</div><blockquote>“{{ block.settings.quote | escape }}”</blockquote><p><strong>{{ block.settings.title }}</strong>{% if block.settings.byline != blank %}<small>{{ block.settings.byline }}</small>{% endif %}</p></div></article>{% endif %}{% endfor %}</div></div></section>
'''
anchor=''' <div class="pbl__faq pbl__wrap"><div><p class="pbl__eye">BEFORE YOU BEGIN</p>'''
if anchor not in s: raise SystemExit('photo markup anchor missing')
s=s.replace(anchor,markup+anchor,1)
css='''.pbl__reviews{padding-block:110px;background:var(--s)}.pbl__reviews-head{display:grid;grid-template-columns:1.25fr .75fr;gap:7vw;align-items:end;margin-bottom:42px}.pbl__reviews-head>p{max-width:560px;margin:0}.pbl__review-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.pbl__review{overflow:hidden;border:2px solid var(--i);border-radius:28px;background:#fff;box-shadow:7px 8px 0 var(--i)}.pbl__review>img{display:block;width:100%;aspect-ratio:1.12;object-fit:cover}.pbl__review-copy{padding:24px}.pbl__stars{display:flex;gap:3px;color:#F5A623;font-size:18px;letter-spacing:.04em}.pbl__stars .is-empty{color:#d7d7d7}.pbl__review blockquote{margin:16px 0 22px;font:700 clamp(18px,1.6vw,24px)/1.28 var(--bf)}.pbl__review-copy p{margin:0}.pbl__review-copy strong,.pbl__review-copy small{display:block}.pbl__review-copy small{margin:3px 0 0;color:#666}
'''
cssanchor='.pbl__faq{display:grid;grid-template-columns:.8fr 1.2fr;gap:8vw}'
if cssanchor not in s: raise SystemExit('photo css anchor missing')
s=s.replace(cssanchor,css+cssanchor,1)
mobileanchor='.pbl__steps ol{grid-template-columns:1fr}'
mobile='.pbl__reviews{padding-block:78px}.pbl__reviews-head{display:block;margin-bottom:30px}.pbl__reviews-head>p{margin-top:18px}.pbl__review-grid{display:flex;overflow-x:auto;gap:14px;margin-right:-18px;padding:5px 18px 12px 2px;scroll-snap-type:x mandatory}.pbl__review{flex:0 0 82vw;scroll-snap-align:start}.pbl__review-copy{padding:20px}'
if mobileanchor not in s: raise SystemExit('photo mobile anchor missing')
s=s.replace(mobileanchor,mobile+mobileanchor,1)
old='''{"type":"faq","name":"FAQ","settings":[{"type":"text","id":"q","label":"Question","default":"How much does it cost?"},{"type":"richtext","id":"a","label":"Answer","default":"<p>Regular starts at ₹2,799 and Large starts at ₹3,099.</p>"}]}'''
review='''{"type":"review","name":"Review","settings":[{"type":"image_picker","id":"image","label":"Review image"},{"type":"text","id":"asset","label":"Fallback asset filename"},{"type":"range","id":"rating","label":"Star rating","min":1,"max":5,"step":1,"default":5},{"type":"text","id":"title","label":"Reviewer or review title","default":"Verified customer"},{"type":"text","id":"byline","label":"Album type"},{"type":"textarea","id":"quote","label":"Review","default":"Add a verified customer review here."}]},'''+old
if old not in s: raise SystemExit('photo schema anchor missing')
s=s.replace(old,review,1)
sec.write_text(s,encoding='utf-8')

for name in ['collection.photo-books.json','page.photo-books.json']:
 p=root/'templates'/name
 t=p.read_text(encoding='utf-8')
 marker='''        "f1": {'''
 blocks='''        "r1": {
          "type": "review",
          "settings": {
            "asset": "june-review-family-book.jpg",
            "rating": 5,
            "title": "Launch review preview",
            "byline": "Family album",
            "quote": "The matte cover feels beautiful in hand, and seeing the photographs together makes the whole story feel complete."
          }
        },
        "r2": {
          "type": "review",
          "settings": {
            "asset": "june-review-travel-books.jpg",
            "rating": 5,
            "title": "Launch review preview",
            "byline": "Travel collection",
            "quote": "Years of travel photos finally became books we can leave on the table, open often and share with everyone."
          }
        },
        "r3": {
          "type": "review",
          "settings": {
            "asset": "june-photobook-baby.jpg",
            "rating": 5,
            "title": "Launch review preview",
            "byline": "First-year book",
            "quote": "The print is rich, the pages feel substantial and every tiny detail from the first year now has a proper home."
          }
        },
'''
 if marker not in t: raise SystemExit(f'template block anchor missing {name}')
 t=t.replace(marker,blocks+marker,1)
 order='''        "o4",
        "f1",'''
 order2='''        "o4",
        "r1",
        "r2",
        "r3",
        "f1",'''
 if order not in t: raise SystemExit(f'template order anchor missing {name}')
 p.write_text(t.replace(order,order2,1),encoding='utf-8')

# Our Days markup and CSS
op=Path('our-days-landing/index.html')
o=op.read_text(encoding='utf-8')
anchor2='''    <section class="trust section-shell">'''
reviews='''    <section class="od-reviews" aria-labelledby="od-reviews-title">
      <div class="section-shell">
        <div class="od-reviews-head"><div><p class="eyebrow">Held close. Opened often.</p><h2 id="od-reviews-title">Five little stars for the big little moments.</h2></div><p>Launch review previews shown with real book inspiration. Replace the sample wording with verified customer feedback as orders arrive.</p></div>
        <div class="od-review-grid">
          <article class="od-review-card"><img src="assets/review-family-book.jpg" alt="A personalised family photo book held in both hands" loading="lazy"><div><span class="od-stars" aria-label="5 out of 5 stars">★★★★★</span><blockquote>“The prompts helped us notice the tiny moments we would otherwise forget. The finished book feels deeply personal.”</blockquote><p><strong>Launch review preview</strong><small>Our Days family book</small></p></div></article>
          <article class="od-review-card"><img src="assets/open-book-v1.jpg" alt="An open Our Days memory book" loading="lazy"><div><span class="od-stars" aria-label="5 out of 5 stars">★★★★★</span><blockquote>“I loved that we could edit everything before printing. It still sounds like us, only beautifully put together.”</blockquote><p><strong>Launch review preview</strong><small>Six-month chapter</small></p></div></article>
          <article class="od-review-card"><img src="assets/review-travel-books.jpg" alt="A collection of printed travel photo books" loading="lazy"><div><span class="od-stars" aria-label="5 out of 5 stars">★★★★★</span><blockquote>“We finished the whole trip after coming home and turned it into something everyone keeps picking up.”</blockquote><p><strong>Launch review preview</strong><small>Build-now travel book</small></p></div></article>
        </div>
      </div>
    </section>

'''
if anchor2 not in o: raise SystemExit('Our Days markup anchor missing')
op.write_text(o.replace(anchor2,reviews+anchor2,1),encoding='utf-8')
cssp=Path('our-days-landing/styles.css')
c=cssp.read_text(encoding='utf-8')
addcss='''
.od-reviews{padding:110px 0;background:var(--pink);border-block:2px solid var(--ink)}.od-reviews-head{display:grid;grid-template-columns:1.25fr .75fr;gap:7vw;align-items:end;margin-bottom:48px}.od-reviews h2{font:800 clamp(45px,5vw,76px)/.95 Poppins,sans-serif;letter-spacing:-.065em;margin:0}.od-reviews-head>p{font-size:18px;line-height:1.5;margin:0}.od-review-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.od-review-card{overflow:hidden;border:2px solid var(--ink);border-radius:28px;background:var(--white);box-shadow:8px 10px 0 var(--ink)}.od-review-card>img{display:block;width:100%;aspect-ratio:1.08;object-fit:cover}.od-review-card>div{padding:24px}.od-stars{display:block;color:#e59700;font-size:19px;letter-spacing:.08em}.od-review-card blockquote{margin:16px 0 24px;font:700 clamp(18px,1.6vw,24px)/1.3 Poppins,sans-serif}.od-review-card p{margin:0}.od-review-card strong,.od-review-card small{display:block}.od-review-card small{margin-top:3px;color:#665f55}
@media(max-width:800px){.od-reviews{padding:80px 0}.od-reviews-head{display:block;margin-bottom:34px}.od-reviews h2{font-size:47px}.od-reviews-head>p{margin-top:20px;font-size:16px}.od-review-grid{display:flex;overflow-x:auto;gap:14px;margin-right:-14px;padding:5px 18px 14px 2px;scroll-snap-type:x mandatory}.od-review-card{flex:0 0 84vw;scroll-snap-align:start}.od-review-card>div{padding:20px}}
'''
cssp.write_text(c+'\n'+addcss,encoding='utf-8')
