from pathlib import Path
import html,json
p=Path(__file__).parent
rows=[
('Header & search','00-search.png',[
('Fix','The animated logo repeatedly dissolves into dots and a black shape. On a phone this reads as a broken logo. Use a stable mobile logo; retain desktop animation if desired.'),
('Improve','Search suggestions fill a tall, mostly empty panel. Make the initial list compact and keep results close to the field.'),
('Content','Rakhi Gifts and Gifts for Sister lead the October search suggestions. Review seasonal relevance rather than presenting an old campaign as current.')]),
('1 · Hero','01-limited-confirmed.png',[
('Improve','Undated copy, full-width primary action and separate secondary action push the artwork and category tabs below the initial phone screen.'),
('Improve','Equal tab heights are retained, but shorter Limited/Journal content leaves conspicuous blank space below. Rebalance internal spacing without allowing tab-height jumps.'),
('Improve','Four category tabs wrap differently: Limited Edition, Life Journals and 2027 Coming soon occupy different line counts. Standardise icon and label alignment.'),
('Investigate','Limited artwork was blank immediately after switching and appeared on a subsequent capture. Preload adjacent hero artwork and verify on a cold connection; do not treat the initial blank frame as a permanently missing image.')]),
('2 · Undated','02-undated-details.png',[
('Fix','Delivery details and Returns policy visually run together in the mobile layout. Restore an explicit gap and independent touch areas.'),
('Improve','Large swipeable covers are followed by a second thumbnail selector. This duplicates visual decision controls and adds height.'),
('Improve','Interior preview is a tiny square beside a multi-line copy block. The useful page detail is unreadable until enlarged; give the preview more width.'),
('Improve','Purchase, compare, reassurance and interior exploration become four stacked bands. Tighten their relationship while preserving the primary purchase action.')]),
('3 · Limited Edition','03-limited.png',[
('Improve','Heading, tall cover stage, cover thumbnails and selected title push the purchase action well below the initial section view.'),
('Improve','The freebies badge competes with the cover at a similar visual weight. Reduce it on phones while preserving the included count.'),
('Improve','Expanded extras show one large card and a clipped neighbour at375px. Add an explicit swipe cue or compact count; the crop is carousel behaviour, not page overflow.'),
('Improve','The unboxing toggle looks as prominent as the shopping action. Differentiate exploration from purchase more clearly.')]),
('4 · 2027 announcement','03-limited-bottom.png',[
('Improve','The introduction, large portal and second signup headline occupy roughly a screen before the form is reached. Reduce portal and inter-block spacing on mobile.'),
('Improve','Two competing bold headings split a single announcement into two visual sections. Keep the main heading and subordinate the signup prompt.'),
('Improve','The year extends beyond the portal outline. This can be intentional, but needs a tighter mobile composition rather than desktop proportions stacked vertically.')]),
('5 · Inside Discovery','05-inside-main.png',[
('Improve','The planner spread is soft and its annotations are illegible at the displayed size. Prefer a sharper genuine source and crop for page content.'),
('Improve','Weekly plans wraps while neighbouring labels remain one line. Give tabs a consistent two-line rhythm or use a deliberate horizontal control.'),
('Improve','Description, large preview action, shopping link and attribution create a long tail. Shorten the description and quieten the attribution without removing the product link.')]),
('6 · Other Chapters','06-story-start.png',[
('Improve','The initial blank stage can look like the page failed to load. Keep the approved empty opening but shorten the lead-in or add a subtle scroll cue.'),
('Improve','Much of each pinned screen is empty above the product. Rebalance product/copy vertically for small screens while preserving one shared stage.'),
('Improve','The visible control says Skip the story rather than the approved Skip to shopping. The latter explains the destination more clearly.')]),
('7 · Home Décor','07-decor.png',[
('Fix','A floral-sticks photo/product URL appears under Black & white ceramic vase, with vase specifications. Resolve the actual product mapping before adjusting styling.'),
('Improve','Large numbered hotspots and a second Vase/Birds/Frame selector compete. Choose one primary mobile selection mechanism.'),
('Improve','The actual product thumbnail is very small beside wrapped text and a narrow action. Give real product photography more prominence than the styled scene.')]),
('8 · Lighting','08-lighting-430.png',[
('Fix','Vespera and Gilded Wave backgrounds become enlarged vertical close-ups; the complete lamp and base are lost. Use dedicated mobile artwork/focal framing.'),
('Improve','The heading lies over the bright lamp area, competing with the product silhouette. Reserve quieter space for copy.'),
('Improve','Small dark thumbnails are difficult to distinguish. Increase their useful image area and make selected state clearer.'),
('Improve','The lower product panel covers a substantial part of the scene. Integrate it below the visible lamp on mobile while keeping the same overall photographic treatment.')]),
('9 · Glassware','09-slow-mornings.png',[
('Fix','Slow mornings shows a champagne flute while its title and destination identify Ripple Coffee Mug. This is a product-accuracy defect, not merely styling.'),
('Improve','The large headline, tall photo and bottom buying panel make a long mobile section. Resize the headline/photo together, preserving the approved condensed type.'),
('Improve','There is excessive empty space between Details and All glassware. Remove the mobile minimum-height slack.'),
('Improve','Slow mornings wraps while the other selector labels do not. Align labels consistently.')]),
('10 · Dining','10-dining-bottom.png',[
('Improve','Arrangement controls and product tabs form two consecutive selection layers before the actual purchase details.'),
('Improve','The selected real photo is tiny, while a large gap separates its product title from the price. Rebuild this small product summary as one coherent block.'),
('Improve','Shop the table edit, Lunch essentials and Kitchen organisation each consume a separate band. Compress secondary navigation after the primary action.')]),
('11 · Mystery Box','11-mystery.png',[
('Improve','From ₹1,499 repeats immediately in the first tier, creating redundant pricing emphasis.'),
('Improve','The two box-value links and a generic Explore action compete. Make it clearer whether a row chooses a value or navigates directly.'),
('Improve','How the surprise works overlaps the artwork/base of the box. Separate it slightly for a cleaner silhouette.')]),
('12 · Footer','12-footer.png',[
('Improve','The very large two-line wordmark adds considerable scrolling before payment/localisation details. Scale it down on small screens.'),
('Improve','Visa and Mastercard repeat a logo and text in small badges, while other badges use text only. Standardise badge treatment.'),
('Observed good','Accordion rows and the rebuilt payment row fit the phone width. No reason to rebuild these solely to increase the issue count; preserve their functional layout.')])
]
style='body{margin:0;background:#f5f3fa;color:#202027;font:16px/1.55 system-ui}main{max-width:1150px;margin:auto;padding:40px 24px}h1{font-size:40px;line-height:1.1}h2{margin-top:0}article{display:grid;grid-template-columns:minmax(220px,330px) 1fr;gap:32px;background:white;padding:24px;border-radius:16px;margin:24px 0}img{width:100%;height:auto;border:1px solid #ddd;border-radius:8px}li{margin-bottom:16px}b{display:block}a{color:#493689}.intro{max-width:850px}.note{padding:16px;background:#e9e3f8;border-radius:8px}@media(max-width:700px){article{grid-template-columns:1fr}img{max-width:330px}h1{font-size:30px}}'
parts=['<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>June mobile visual audit</title><style>'+style+'</style></head><body><main><h1>June homepage · mobile visual audit</h1><div class="intro"><p>6 October 2026 · Unpublished theme187527266499 · Read-only inspection</p><p>All12 sections visually inspected at393×852, with selected additional states at375×667 and430×932. Real screenshots below. Chrome capture failed repeatedly; the in-app browser provided reliable images. These are browser viewport checks, not physical iPhone Safari testing.</p><p class="note">The black Shopify draft bar and desktop scrollbar in screenshots are preview tooling, not storefront defects. Some headings cut at a screenshot edge simply continue on scroll. No theme edits or publication were performed.</p><h2>Priority order</h2><p>1. Correct Décor/Glassware product mappings and joined policy links. 2. Fix Lighting mobile art framing and stabilise the mobile logo. 3. Recompose mobile purchasing blocks and shorten repeated controls/blank tails. 4. Verify every revised section visually at all three phone sizes, then confirm desktop regression and exact remote readback.</p><p>Desktop stays unchanged. Retain palette, editable typography, equal hero tab heights and the shared pinned story stage. Editorial spacing recommendations are labelled Improve; they are not all functional defects.</p></div>']
for title,img,items in rows:
 parts.append('<article><a href="'+img+'"><img loading="lazy" src="'+img+'" alt="'+html.escape(title)+' mobile screenshot"></a><div><h2>'+html.escape(title)+'</h2><ul>'+''.join('<li><b>'+html.escape(k)+'</b>'+html.escape(v)+'</li>' for k,v in items)+'</ul></div></article>')
parts.append('<p>Limitations: no physical Safari/keyboard test, exhaustive product-state matrix or checkout testing. No real signup/order submitted. Existing content mismatches require matching real catalog products and approved artwork, not invented replacements.</p></main></body></html>')
(p/'report.html').write_text(''.join(parts),encoding='utf-8')
(p/'findings.json').write_text(json.dumps(rows,indent=2),encoding='utf-8')
print('Created report:',len(rows),'areas;',sum(len(x[2]) for x in rows),'observations')
