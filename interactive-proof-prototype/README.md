# Interactive customer proof — design study, 7 October 2026

Local functional prototype only. No Shopify theme files or merchant settings changed; nothing uploaded or published. This is a desktop-led interaction concept with a mobile adaptation, not the final content-complete customer-proof section.

## Open
Run `node interactive-proof-prototype/server.cjs` from the project root, then visit http://127.0.0.1:4178 . Server listens on loopback only.

## Design
- Heading: “A little love. A lot of June.”
- Five provisional topics: Planners, Delivery, Quality, Gifting, Customer care.
- Six card positions per topic; 5–8 genuine reviews per topic remain the eventual content target.
- Central planner/parcel materialises through blur, opacity, scale and a small 3D turn. Other three objects are provisional vector concept illustrations.
- Cards enter in a staggered sequence, with gentle cursor depth offsets. Review opens in a native modal; no automatic dismissal while reading.
- Nine-second automatic topic changes, progress bar, pause/play, pauses for hover/focus, modal, hidden document and off-screen stage. Touching the review rail pauses playback. Keyboard arrow/Home/End tab navigation.
- Mobile: central object above a horizontal scroll-snap review rail, independently scrollable topic tabs, maximum 6px scroll response. Reduced motion removes effects and defaults autoplay off.
- Lavender is a prototype colour choice matching the recent supplied visual direction. Production must consume the fresh merchant palette, not overwrite it.

## Evidence and content status
Google listing directly inspected in browser: The June Shop, EN-22 Sector V, Kolkata; 4.5 stars, 1,338 reviews on 7 October 2026. Not thousands of reviews studied. Google limited the unauthenticated browser and blocked topic-search/full access behind sign-in.

`review-base.json` contains five research candidates: four short directly observed excerpts and one contextual lead. Excerpts preserve original wording. No invented names/ratings, no verified-purchase badges, no customer-photo reuse. Dotted cards are conspicuously labelled pending slots, not testimonials. Gifting remains a content hypothesis.

All cited review dates are Google's relative display dates as observed, not inferred exact dates. Rating/count is source-dated, not live. Google business reviews must not be presented as reviews of the specific contemporary planner cover illustrated. The planner image is brand/product illustration, not the reviewer’s photograph.

Full content integration needs a signed-in review view or a review-provider export, source IDs/links, original text/rating/date, and photo/avatar usage clearance. Preserve service-recovery context in the Lenny review; do not describe the original delivery as flawless. The historical two-day delivery anecdote is not a delivery promise and is not quoted in the UI.

## Verification gates
1. Source: JavaScript syntax passed; JSON parsed by running app; review provenance seed recorded; no fake testimonials. Reduced-motion rules present, but physical reduced-motion/device behaviour still needs testing.
2. Rendered: 1440×1000 and 393×852 visually inspected; 430×932 inspected; 375×667 checked for overflow after reload. No document-level horizontal overflow at the three phone widths. Six card positions, loaded planner/parcel, tab switching across five topics, arrow-key tab changes, modal opening, Escape close and focus restoration verified. 44px mobile tab height verified. Screenshots in this folder.
3. Reload: fresh 375px reload restored planner scene and six cards. This is a local reload check only; saved-draft reconciliation is NOT applicable/completed. Theme-editor and physical Safari checks not performed.

## Production integration remaining
Fresh pull from unpublished 187527266499; add isolated section with editable content and typography roles (family, weight, desktop/mobile sizes, tracking, line-height), palette roles, per-topic PNG picker and motion duration/enable settings. Do not reuse mismatched product artwork. Keep drafts/placeholders out of the storefront. Validate all 25–40 sourced reviews and links, render all tabs at required widths, upload only changed files, exact remote readback and editor checks. Nothing should publish.

## Generated asset
Built-in image generation used, not CLI. Output copied to `parcel.png` in this directory. The parcel is illustrative concept packaging, not evidence of actual shipping packaging.

Prompt: “Use case: product-mockup. Create a single isolated photorealistic ecommerce shipping parcel for The June Shop, transparent PNG alpha background. A premium kraft cardboard rectangular mailer carton with soft lavender branded paper tape, front-facing three-quarter view, gently tilted 8 degrees, entire object visible with generous transparent margins. Exact brand text on front in heavy friendly black sans serif: The June Shop. Smaller tape print a little more June. Warm natural cardboard texture, believable folds, soft studio lighting from upper left, subtle contact shadow only, no floor or backdrop. No people, no reviews, no ratings, no other objects. This is illustrative branding concept artwork, not a customer photo. Centered square asset suitable for a 3D floating website review scene.”

## Compact reference revision — 7 October 2026
- Replaced mobile review rail with six staggered cards over the central object, closer to the supplied reference.
- Canvas now exact 16:9 desktop (1000 × 562.5 measured) and 1:1 mobile (369 × 369 at 393px). Heading/tabs and attribution remain outside the ratio.
- Added rounded lilac scene background, shorter cards, larger relative object, reduced heading/spacing and decorative floral avatars. These are illustrations, not stock faces misidentified as reviewers.
- Content remains the same verified excerpts and explicitly pending slots; no new testimonials or ratings invented.
- Checked desktop 1440 and mobile 393/375, square ratio, no page overflow, modal open/Escape and customer-care tab after fresh reload. Six current cards stay inside the 375px stage; long future reviews must use short excerpts with expanded readable popup.
- Evidence: compact-desktop.png and compact-mobile.png. Local prototype only; Shopify unchanged.

## Customer DP upload controls
Each of the 30 review slots now has an independent customer photo upload (JPG/PNG/WebP, max 2 MB), circular object-fit crop, remove control and fallback illustration. Real reviews use stable review IDs; unfilled design slots use topic/slot IDs. Photo appears on card and popup. Preview data is localStorage in this browser, not Shopify or a server upload. Tested upload in an unfilled slot using a temporary non-customer test image, persistence after reload, then removal and fallback restoration. Test image removed. Production image_picker controls remain part of theme integration.

## Reference card structure revision
Rebuilt each card as two columns: DP/name at left, actual gold rating above excerpt at right. Compact white rounded rectangle, thin pale-teal edge and soft shadow; removed arrow and card tilt. Pending content remains labelled without fabricated stars. Existing per-review image picker and expanded dialog retained. Syntax check passed; desktop 1440 and mobile 393 visually checked, longer care excerpt fits without horizontal overflow; dialog open/Escape checked. Evidence reference-cards-desktop.png / reference-cards-mobile.png. Prototype only.

Slim-card revision: exact 4:1 card aspect ratio (300x75 desktop; approximately207x52 mobile). First name on one line; full name preserved in accessible label and popup. Lighter Arial card text, larger yellow stars, two-line excerpt clamp with popup for complete sourced excerpt. Customer DP picker unchanged. Checked393px no horizontal overflow and dialog/full attribution. Local prototype only.

## Reference-only refinement — 8 October 2026
Added isolated reference-clean.css: solid lavender stage, no orbit/captions/sparks/stat footer, compact Poppins capsules with SVG gold stars for sourced ratings and true front/back layering around the product. Desktop16:9 and mobile1:1 retained. Existing per-card image uploads labelled Add preview photos and explicitly support stock photos for preview followed by customer photos later. Content-pending slots remain labelled; no invented testimonials or ratings. Desktop1440/mobile393 visually inspected. Only local prototype changed; no Shopify writes. Evidence clean-reference-desktop.png and clean-reference-mobile.png.

9 October 2026: tighter cluster, lower product to protect rear-card text, restrained lavender light variation, mint-edged capsules. Poppins names700/copy600 preserved. Unsourced slots visibly labelled Sample, including illustrative star layout (not actual ratings). Sourced review excerpts unchanged. Per-card preview photo upload retained. Local only.
