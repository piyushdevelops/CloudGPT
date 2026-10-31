# 2027 Dated Planner PDP pilot — 23 October 2026

## Scope

Installed three new files on unpublished theme `187527266499` only:

- `sections/june-dated-pdp.liquid`: gallery, title, variant choice, live price, conditional `properties[Name]` input, product form, mobile purchase bar.
- `sections/june-dated-details.liquid`: description, optional inside-page image blocks, optional verified specification and FAQ blocks, closing action.
- `templates/product.june_dated_2027.json`: two-section template with dedicated typography control blocks.

Assigned only product `14951558414531` (Create Your Magic — 2027 Dated Planner) to this template. It remains DRAFT. No shared files, other products, or live theme were changed.

## Design basis

Reviewed the store's active Undated Planner product template and the current unpublished theme typography and palette controls. External primary merchant references: Erin Condren LifePlanner (configuration clarity), Papier planner pages (inside preview and details), Hemlock & Oak planner pages (format, material, shipping and review information). These are design-pattern references, not conversion-rate claims.

The new sections inherit the June palette roles and offer section-scoped family, weight, desktop/mobile size, letter spacing and line height for headings, copy, and controls. Empty media, facts and FAQs do not render. No date range, page count, paper, size, inclusions, or dispatch promise was invented.

## Verification

- Shopify accepted all three files; final readback for both Liquid files matched exactly. The JSON template readback was structurally identical after Shopify's generated-file header.
- After a variant-price fix, `june-dated-pdp.liquid` passed local Liquid validation and exact remote readback matched.
- Draft-theme preview rendered HTTP 200 at 1440, 393 and 320 px; cover image loaded, no horizontal overflow or page JavaScript exceptions.
- Functional browser check: Add Name shows ₹2,099 and a required name field included in form data; Without Name shows ₹1,999 and removes that field from form data. The option switch is reversible and prints no markup in the price.
- Product readback confirmed DRAFT status and `june_dated_2027` template suffix.

## Before launch

- Add approved inside-page images and verified specifications/FAQs in the theme editor.
- Confirm the personalization process, name limits, and fulfillment rules.
- Add inventory or preorder configuration and test an actual cart-to-checkout path; both variants currently have zero inventory.
- Complete merchant review in desktop/mobile theme editor and physical iPhone Safari.

Nothing was published.

## Tag-driven preorder mode — 24 October 2026

Added a reusable preorder state to the dedicated 2027 dated-planner PDP. The exact, case-sensitive product tag is `June-Preorder-2027`.

When the tag is present, the template now changes the purchase area to:

- Show a `PRE-ORDER · 2027` badge and `Pre-order price` label.
- Show editable reservation copy, expected dispatch copy and delivery guidance.
- Replace the normal add-to-cart treatment with a darker `Pre-order now` action while retaining the June palette variables.
- Carry `Purchase type`, a hidden `_Pre-order campaign` identifier and the configured expected-dispatch text into the cart as line item properties.
- Keep the two existing personalisation variants and prices intact.

All 25 products using `june_dated_2027` received the tag. Both variants on every product now use Shopify's `CONTINUE` inventory policy, so the planners can be sold through zero stock once the merchant activates them. Final Admin readback confirmed 25/25 products are still DRAFT, 25/25 have the preorder tag, and 50/50 variants use `CONTINUE` and are available for sale.

The two theme files were fetched immediately before the write and still matched the expected baseline. Final remote readback matched `sections/june-dated-pdp.liquid` exactly and `templates/product.june_dated_2027.json` structurally. The tagged draft preview confirmed the preorder mode, enabled CTA, ₹2,099 / ₹1,999 variant switching, name-field behavior and preorder cart properties.

Shopify Flow's official “Tag orders that include products with specific product tags” template is installed and active as workflow `01a16f1a-2c5b-72c9-a00d-ea8e01b74d30`: Order created → at least one line-item product tag is one of `June-Preorder-2027` → add order tags `Pre-order` and `Pre-order-2027`. The active workflow was verified in Shopify Admin on 24 October 2026.

Before launch, replace the placeholder dispatch sentence with the confirmed date in the `Pre-order mode` settings, run one controlled test order to prove the first live execution and then activate the products. Nothing was published.

## 2026 specification parity and 25-product rollout — 24 October 2026

The user confirmed that the 2027 dated planners share the 2026 dated-planner specifications and that all 25 covers are already uploaded to their Shopify products. Two active 2026 dated-planner listings were checked and their shared specification blocks matched.

The dedicated 2027 template now shows the confirmed shared specifications:

- 286 sides (131 pages and 12 month dividers)
- 100 GSM regular pages and 200 GSM dividers
- 19.5 × 23 × 3.2 cm
- Gold wiro binding
- Hardbound cover
- Back pocket
- Free sticker book with 225 stickers across 6 pages
- Country of origin: India

The cover-specific “Create Your Magic” fact was removed from the shared template so each product can use its own title and uploaded product media. The template remains merchant-editable.

All 25 products tagged \`Dated-Planner-2027\` now use the \`june_dated_2027\` template. Final Admin readback confirmed:

- 25/25 products remain DRAFT.
- 25/25 products have a featured image.
- 25/25 products use \`june_dated_2027\`.
- Each product retains the two existing variants: Add Name at ₹2,099 and Without Name at ₹1,999.
- No title, description, image, variant, price, inventory or publication status was changed during this rollout.

The only theme file changed was \`templates/product.june_dated_2027.json\` on unpublished theme \`187527266499\`. Its final checksum is \`f02a1e3ce73a9489c6d6f095cefde55a\`; Shopify’s generated-file readback is structurally identical to the local JSON. Nothing was published.

## Approved storybook reference completion — 24 October 2026

The earlier card-based adaptation was replaced after the visual parity review. The installed PDP now follows the approved Option 2 composition directly while continuing to use the June master palette and merchant-controlled Poppins typography:

- Asymmetric torn-paper hero collage with rotated planner artwork, paper notes, botanical shapes and a floating purchase card.
- Four editorial image chapters in a staggered magazine rhythm; the complete supplied feature lists remain accessible inside each chapter.
- Full-width women/divider story with an overlapping postcard rail and editable image slots for all 12 final artworks.
- Large open-planner interior stage led by the verified monthly calendar spread, with the remaining verified pages in the same accessible slider.
- Cleaner specification grid, paper-style quote and full-width closing action.
- Responsive mobile composition with the same visual hierarchy, accessible horizontal galleries and no page-level horizontal overflow.

Final remote checksums on unpublished theme `187527266499`:

- `sections/june-dated-pdp.liquid`: `91f6fb136654a960a047b0778714f3ac`
- `sections/june-dated-details.liquid`: `f0ddee216a6f36448210dad0c170e834`
- `templates/product.june_dated_2027.json`: `285c1b339036f8f7e26ce6134da5bc7e`

Both Liquid files passed exact readback; the Shopify-generated template passed structural readback. Theme Check found no target-file issues. Preview checks at 1440, 393 and 320 px returned HTTP 200 with 4 chapters, 12 divider slots, 6 interior slides, 7 verified facts and 5 FAQs; there was no page overflow or JavaScript exception. The final 12 illustrated women/divider artworks are still required to replace the deliberate numbered art slots. The draft product remains unpublished and the working theme remains unpublished.

## Structured “What’s inside” rollout — 24 October 2026

Added the final merchant-supplied content as a dedicated, editable section instead of placing a long feature list in the product description:

- Four numbered feature groups cover yearly planning and self-growth, 12 women-focused monthly dividers, monthly planning spreads, and year-end spreads.
- The full supplied list is retained, including Misogi and 75 Soft challenges, detachable postcards, Spotify song dedications, routines, meals, habits, expenses, monthly resets, reflections, travel and future-self prompts.
- Purchase-area highlights now communicate intention, celebrating women, planning and reflection, and name personalisation.
- Added a focused FAQ for the illustrated monthly dividers, postcards and song dedications.
- Rewrote the draft product story around “The Little Luxuries of Life” while retaining the Create Your Magic cover name and statutory origin/packer details.

The feature groups and heading are editable in the theme editor. Their typography follows the section’s existing merchant controls and June palette roles. The two target theme files were fetched immediately before upload; no concurrent change was detected. Final readback matched the Liquid exactly and the JSON template structurally. The product description also matched exact Admin readback and the product remains DRAFT.

The unpublished-theme reference preview passed at 1440, 393 and 320 px: 4 highlights, 4 feature groups, 6 interior cards, 7 facts and 5 FAQs; all six interior images loaded after horizontal traversal; no horizontal overflow or JavaScript exceptions. The reference preview uses an active product with the template view because Shopify does not expose the draft product on an unsigned storefront URL. Final merchant review of the actual draft in the theme editor remains required. Nothing was published.

## Premium planner-paper polish — 24 October 2026

Added a restrained dot-grid paper system and deeper physical-paper treatment across the dedicated 2027 PDP without changing its content, typography controls or section structure:

- Subtle planner dot grids now sit behind the hero, story introduction, divider story, interior preview and specification cards.
- The hero collage, purchase card, chapter cards, divider postcards and interior spreads now use layered paper edges and multi-level shadows.
- Inputs, variant selectors, gallery thumbnails and the primary action gained refined depth and interaction states.
- Mobile shadows were rebalanced and clipped within their components so the visual layers do not create page-level horizontal overflow.

Both Liquid files passed Shopify Liquid validation. Final preview checks returned HTTP 200 at 1440, 393 and 320 px with no JavaScript exceptions and no horizontal overflow. Final remote checksums on unpublished theme `187527266499` are `f192fa14f257cd9bd925ae66333e96de` for `sections/june-dated-pdp.liquid` and `8a4bc9dfa57675cda99173ca93b3641f` for `sections/june-dated-details.liquid`. Exact readback remained required after this record update. Nothing was published.

## Immersive storybook redesign — 24 October 2026

The user approved visual direction 2 and authorised a full PDP recreation using the June theme system. The existing two custom sections and dedicated product template were revised in place:

- Layered paper-style product stage with a tilted editorial note, strong product scale and sticky carded purchase panel.
- Four image-led story chapters for growth, celebrating women, monthly planning and year-end reflection.
- A dedicated 12-month horizontal divider/postcard rail with editable month, artwork and celebrated-quality fields.
- Larger interior-page storytelling, an editorial quote band, retained verified specifications and retained FAQs.
- All colours resolve from the June master palette roles; no fixed mockup palette was installed.
- Existing section-scoped font family, weight, desktop/mobile size, tracking and line-height controls remain active.

The supplied PDFs do not contain the final 12 illustrated divider/postcard artworks. The rail therefore uses honest numbered month cards until those assets and quality names are supplied. No qualities, dispatch promises, page counts, materials or other unverified product claims were invented.

Concurrency protocol was followed: all three target files were fetched immediately before upload and still matched the expected baseline. Final remote readback matched both Liquid files exactly and the JSON template structurally. Final checks at 1440, 393 and 320 px rendered 4 story chapters, 12 divider cards, 6 interior cards, 7 facts and 5 FAQs; all chapter/interior images loaded, horizontal overflow was absent and no JavaScript exceptions occurred. Shopify Theme Check reported no errors for the three target files. Nothing was published.

## Reference-led refinement — 23 October 2026

After reviewing the Alicia Souza 2027 bundle PDP and the active June Undated Planner PDP, the template was refined without adding unverified product claims:

- Added three concise, editable planner highlights below the purchase form.
- Changed the first product image to eager/high-priority loading; later gallery media remains lazy-loaded.
- Upgraded the optional inside-page area into a numbered, horizontal walkthrough with previous/next controls, snap scrolling and reduced-motion handling.
- Added an optional “What’s included” block type with image, title and short description.
- Kept inside pages, included items, verified specifications and FAQs fully conditional; empty blocks render nothing.
- Preserved section-scoped merchant typography controls and June palette variables.

The three target files were fetched again immediately before upload. No concurrent changes were detected. Shopify accepted the scoped update; both Liquid files matched exact remote readback and the JSON template matched structurally after Shopify’s generated header.

Post-upload checks passed at 1440, 393 and 320 px with HTTP 200, loaded product imagery, no horizontal page overflow and no JavaScript exceptions. Variant switching still moves between ₹2,099 with required name personalisation and ₹1,999 without the name property. The product remains a draft with zero inventory, so an end-to-end cart/checkout test remains pending.

## Interior content rollout — 23 October 2026

Reviewed the supplied 2027 print PDFs and added an evidence-based PDP content set:

- Exported six optimized storefront references from the supplied March interior artwork: month opening, monthly calendar, weekly planning, meal planner, habit tracker, and money/reflection spread.
- Uploaded all six images to Shopify Files and connected them to the optional inside-page walkthrough with feature-led titles and source captions.
- Reworked the three purchase-area USPs around yearly planning, personalisation, and the planner's guided tools.
- Added seven verified fact cards: year, format, planning views, guided tools, cover artwork, personalisation options, and country of origin.
- Added four FAQs covering dated format, name personalisation, inside content, and the origin of the preview imagery.
- Updated the draft product description with the same verified feature hierarchy.
- Left size, paper, binding, finish, final page count, inclusions, dispatch, and preorder claims unset because they have not been verified.

Concurrency protocol was followed for the only theme write. The remote JSON template checksum was rechecked immediately before upload, then the final Shopify-generated readback matched the local JSON structurally. Final remote checksum: `b2068f32448824f276befd684d8f9d3f`.

The unpublished-theme reference preview returned HTTP 200 at 1440, 393 and 320 px. It rendered 3 USPs, 6 inside-page cards, 7 facts and 4 FAQs with no horizontal overflow or JavaScript exceptions. All six CDN assets returned HTTP 200. The actual product remains DRAFT with zero inventory and therefore returns 404 through an unsigned public storefront URL; product and template assignment were confirmed through Admin readback. Nothing was published.

## Preorder functional QA — 25 October 2026

Validated the dedicated 2027 preorder purchase form on the unpublished-theme product preview:

- Add Name shows ₹2,099, exposes the name field and blocks submission when the required name is empty.
- Without Name shows ₹1,999 and removes the name field from the purchase flow.
- The preorder badge, price treatment and CTA remain visible at a 390 × 844 phone viewport with no horizontal overflow.
- The form contains the preorder purchase type, campaign and expected-dispatch line-item properties.
- Shopify rejected the final cart submission with `Cannot find variant` because the product is still DRAFT. This is a Shopify publication-state gate rather than a client-side form failure; Shopify cannot create a storefront cart line for a draft variant.

No test order was created. Complete the cart-to-order and Flow tag verification only after one planner is explicitly activated for launch testing or when the products are launched. Nothing was published.

## Confirmed preorder dispatch date — 25 October 2026

The preorder dispatch promise is now set to **Expected dispatch by 10 November 2026.** in the dedicated 2027 product template. Because the same setting populates the hidden `Expected dispatch` cart property, the customer-facing message and future order line data remain aligned.

Before the write, the remote template was fetched twice and still matched checksum `6c26be32c50d356617ad7fb268b05cd7`; no concurrent change was detected. The scoped update changed only `templates/product.june_dated_2027.json` on unpublished theme `187527266499`. Final Shopify checksum: `919e7866a2f2c2dedc034c634b971a19`. Final structural readback matched the local template, and the refreshed draft preview displayed the new date. Nothing was published.
