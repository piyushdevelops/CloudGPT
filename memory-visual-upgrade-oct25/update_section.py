from pathlib import Path

path = Path("memory-visual-upgrade-oct25/remote-before/sections/june-memory-feature.liquid")
text = path.read_text(encoding="utf-8")

old_markup = """      {% if section.settings.art_style == 'our_days' %}
        <div class="jmf__phone"><b>Our Days</b><span>What made everyone laugh today?</span><em>{{ section.settings.sample_text | escape }}</em><small>Saved to your book ✓</small></div>
        <div class="jmf__book"><span>BOOK 01</span><strong>Little days.<br>One big story.</strong></div>
        <span class="jmf__sticker">one day<br>at a time</span>
      {% else %}
        <div class="jmf__album jmf__album--back"><span>OUR STORY</span></div>
        <div class="jmf__spread"><div><small>12 AUGUST</small><strong>{{ section.settings.sample_heading | escape }}</strong><p>{{ section.settings.sample_text | escape }}</p></div><div class="jmf__photo"><span>YOUR<br>PHOTO</span></div></div>
        <span class="jmf__tape jmf__tape--one"></span><span class="jmf__tape jmf__tape--two"></span>
      {% endif %}"""

new_markup = """      {% if section.settings.art_style == 'our_days' %}
        {% if section.settings.our_days_photo != blank %}{% assign memory_photo = section.settings.our_days_photo | image_url: width: 1400 %}{% else %}{% assign memory_photo = 'june-our-days-family-v2.webp' | asset_url %}{% endif %}
        <div class="jmf__keepsake" aria-hidden="true">
          <span class="jmf__keepsake-kicker">VOLUME 01</span><strong>Little days.<br>One big story.</strong>
          <img src="{{ memory_photo }}" alt="" width="720" height="540" loading="lazy">
        </div>
        <div class="jmf__phone">
          <div class="jmf__phone-top"><b>Our Days</b><span aria-hidden="true">•••</span></div>
          <p class="jmf__prompt">What made everyone laugh today?</p>
          <figure class="jmf__memory-photo"><img src="{{ memory_photo }}" alt="" width="720" height="540" loading="lazy"></figure>
          <p class="jmf__reply">{{ section.settings.sample_text | escape }}</p>
          <small><i aria-hidden="true">✓</i> Saved to your book</small>
        </div>
        <span class="jmf__sticker">one day<br>at a time</span>
      {% else %}
        {% if section.settings.photo_book_photo != blank %}{% assign album_photo = section.settings.photo_book_photo | image_url: width: 1600 %}{% else %}{% assign album_photo = 'june-photo-book-travel-v2.webp' | asset_url %}{% endif %}
        <div class="jmf__album jmf__album--back"><span>THE JUNE SHOP</span><strong>OUR<br>STORY</strong><small>PHOTO BOOK · 2026</small></div>
        <div class="jmf__spread">
          <div class="jmf__story-page"><small>12 AUGUST · GOA</small><strong>{{ section.settings.sample_heading | escape }}</strong><p>{{ section.settings.sample_text | escape }}</p><span>24</span></div>
          <figure class="jmf__photo"><img src="{{ album_photo }}" alt="" width="960" height="720" loading="lazy"><figcaption>Some days deserve more than a camera roll.</figcaption><span>25</span></figure>
          <i class="jmf__gutter" aria-hidden="true"></i>
        </div>
        <span class="jmf__tape jmf__tape--one"></span><span class="jmf__tape jmf__tape--two"></span>
      {% endif %}"""

if old_markup not in text:
    raise SystemExit("Target markup not found")
text = text.replace(old_markup, new_markup)

css_start = text.index(".jmf__scene{position:relative")
css_end = text.index("@media(prefers-reduced-motion:reduce)")
new_css = r""".jmf__scene{position:relative;min-height:620px;background:color-mix(in srgb,var(--mf-accent) 32%,var(--mf-bg));isolation:isolate;overflow:hidden}.jmf--our_days .jmf__scene{background:radial-gradient(circle at 18% 18%,#fff 0 3px,transparent 4px) 0 0/34px 34px,color-mix(in srgb,#bfe3ed 70%,var(--mf-bg))}.jmf__keepsake{position:absolute;right:-2%;bottom:4%;width:54%;height:63%;padding:27px 28px 25px;border:3px solid var(--mf-ink);border-radius:4px;background:#ef7464;box-shadow:16px 16px 0 var(--mf-ink);transform:rotate(6deg);display:flex;flex-direction:column;color:var(--mf-ink)}.jmf__keepsake-kicker{font-size:11px;font-weight:800;letter-spacing:.16em}.jmf__keepsake strong{margin:14px 0 18px;font-size:clamp(27px,3vw,42px);line-height:.92;letter-spacing:-.05em}.jmf__keepsake img{width:100%;height:44%;margin-top:auto;object-fit:cover;border:2px solid var(--mf-ink);filter:saturate(.92) contrast(1.03)}.jmf__phone{position:absolute;z-index:3;left:7%;top:9%;width:52%;height:78%;min-height:480px;padding:25px 24px 20px;border:3px solid var(--mf-ink);border-radius:38px;background:#e9f5e6;box-shadow:14px 18px 0 var(--mf-ink);transform:rotate(-4deg);display:flex;flex-direction:column;gap:14px}.jmf__phone-top{display:flex;align-items:center;justify-content:space-between}.jmf__phone-top b{font-size:24px}.jmf__phone-top span{font-size:17px;font-weight:900;letter-spacing:2px}.jmf__phone p{margin:0;font-style:normal;line-height:1.28}.jmf__prompt{padding:14px 16px;border-radius:17px;background:#fff;font-size:16px}.jmf__memory-photo{margin:0;min-height:145px;flex:1;overflow:hidden;border-radius:20px;border:2px solid #fff}.jmf__memory-photo img{display:block;width:100%;height:100%;object-fit:cover}.jmf__reply{align-self:flex-end;max-width:88%;padding:13px 16px;border-radius:17px;background:#caf0bd;font-size:15px}.jmf__phone small{display:flex;align-items:center;justify-content:center;gap:8px;font-weight:750}.jmf__phone small i{display:grid;place-items:center;width:24px;height:24px;border-radius:50%;background:var(--mf-ink);color:#fff;font-style:normal}.jmf__sticker{position:absolute;z-index:5;right:6%;top:7%;display:grid;place-items:center;width:120px;height:120px;border:3px solid var(--mf-ink);border-radius:50%;background:#ffd255;box-shadow:6px 7px 0 #1717172b;text-align:center;font-weight:900;line-height:1.04;transform:rotate(8deg)}.jmf--photo_books .jmf__scene{background:linear-gradient(135deg,#f4b6c8 0 44%,#a8d8ea 44%)}.jmf__album{position:absolute;left:6%;top:8%;width:58%;height:73%;padding:34px;border:3px solid var(--mf-ink);background:#164d3b;box-shadow:16px 16px 0 var(--mf-ink);transform:rotate(-7deg);color:#f3d7a6;display:flex;flex-direction:column;justify-content:space-between}.jmf__album>span,.jmf__album>small{font-size:11px;font-weight:800;letter-spacing:.16em}.jmf__album strong{font-family:Georgia,serif;font-size:clamp(44px,5.3vw,76px);font-weight:400;line-height:.83;letter-spacing:-.07em}.jmf__spread{position:absolute;z-index:3;right:3%;bottom:7%;width:80%;height:66%;display:grid;grid-template-columns:.82fr 1.18fr;border:3px solid var(--mf-ink);border-radius:3px 11px 11px 3px;background:#fffdf6;box-shadow:14px 15px 0 #17171755;transform:rotate(3deg);overflow:hidden}.jmf__spread>div,.jmf__spread>figure{padding:28px}.jmf__story-page{position:relative;display:flex;flex-direction:column}.jmf__story-page small{display:block;font-size:10px;font-weight:800;letter-spacing:.15em}.jmf__story-page strong{display:block;margin-top:28px;font-family:Georgia,serif;font-size:clamp(29px,3vw,42px);font-weight:400;line-height:.94;letter-spacing:-.04em}.jmf__story-page p{font-size:14px;line-height:1.45}.jmf__story-page>span,.jmf__photo>span{position:absolute;bottom:12px;font-size:9px;font-weight:700}.jmf__story-page>span{left:27px}.jmf__photo{position:relative;display:flex;flex-direction:column;margin:0;background:#f0e9df}.jmf__photo img{width:100%;min-height:0;flex:1;object-fit:cover;border-radius:2px;filter:saturate(.94) contrast(1.03)}.jmf__photo figcaption{padding:11px 0 4px;font-size:12px;font-weight:750;line-height:1.25}.jmf__photo>span{right:27px}.jmf__gutter{position:absolute;z-index:2;left:40.8%;top:0;width:12px;height:100%;background:linear-gradient(90deg,#00000008,#00000023 48%,#fff8 52%,transparent);transform:translateX(-50%)}.jmf__tape{position:absolute;z-index:4;width:120px;height:34px;background:#fff1b8c7;box-shadow:0 2px 4px #0001}.jmf__tape--one{right:4%;top:11%;transform:rotate(16deg)}.jmf__tape--two{left:14%;bottom:6%;transform:rotate(-15deg)}@media(max-width:899px){.jmf__inner{grid-template-columns:1fr;min-height:0}.jmf__copy{padding:46px 22px 34px}.jmf h2{font-size:var(--mf-heading-mobile)}.jmf__body{font-size:var(--mf-body-mobile);margin-top:18px}.jmf__button{width:100%;font-size:var(--mf-button-mobile)}.jmf__scene{min-height:520px}.jmf__keepsake{right:-10%;bottom:4%;width:58%;height:59%;padding:18px}.jmf__keepsake strong{font-size:27px}.jmf__keepsake img{height:40%}.jmf__phone{left:5%;top:8%;width:64%;height:80%;min-height:0;padding:18px 17px 15px;border-radius:28px;gap:10px}.jmf__phone-top b{font-size:20px}.jmf__prompt{padding:11px 13px;font-size:13px}.jmf__memory-photo{min-height:125px;border-radius:15px}.jmf__reply{padding:10px 12px;font-size:12px}.jmf__phone small{font-size:10px}.jmf__phone small i{width:19px;height:19px}.jmf__sticker{right:4%;top:5%;width:88px;height:88px;font-size:12px}.jmf__album{left:3%;top:8%;width:66%;height:68%;padding:24px}.jmf__album strong{font-size:43px}.jmf__spread{right:-3%;bottom:8%;width:89%;height:62%;grid-template-columns:.78fr 1.22fr}.jmf__spread>div,.jmf__spread>figure{padding:17px}.jmf__story-page strong{margin-top:20px;font-size:25px}.jmf__story-page p{font-size:11px;line-height:1.35}.jmf__photo figcaption{font-size:10px}.jmf__gutter{left:39%}.jmf__tape{width:88px;height:26px}}"""
text = text[:css_start] + new_css + text[css_end:]

schema_token = '{"type":"text","id":"art_alt","label":"Artwork description","default":"A memory becoming a printed book"}'
schema_replacement = schema_token + ',{"type":"image_picker","id":"our_days_photo","label":"Our Days memory photo"},{"type":"image_picker","id":"photo_book_photo","label":"Photo book memory photo"}'
if schema_token not in text:
    raise SystemExit("Schema target not found")
text = text.replace(schema_token, schema_replacement)

path.write_text(text, encoding="utf-8")
