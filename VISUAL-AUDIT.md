# Visual baseline and sandbox comparison

Reviewed 2026-09-24 in Chromium at 1440×1000 desktop and 390×844 mobile. Captures and extracted page text are in `evidence/browser/`. Theme identity was verified from the rendered page, not inferred from its URL.

## Working theme ready

Created **TJS Website Rework — 24 Sep 2026**, ID **187527266499**, by duplicating live theme 142259323075. Shopify reports UNPUBLISHED, processing false, processingFailed false. All 543 filenames and checksums match the live source at verification. No source files have been edited in the working theme.

[Open working-theme preview](https://thejuneshop.com/?preview_theme_id=187527266499)

The earlier sandbox is **Krish Sandbox TJS August 2026 (Primary Theme)**, ID 187467956419. It remains unchanged. Six shared files differ from live, 17 files exist only in live, and 13 only in the sandbox. See `evidence/theme-comparison.json` for exact filenames.

## Live website observations

| Area | Observed result | Redesign action |
| --- | --- | --- |
| Homepage, mobile | Header/search, introductory copy, CTA and reviews appear before category imagery. The first product imagery begins roughly 610px down the 844px viewport. | Bring department discovery and product imagery earlier; compact the introductory and trust content. |
| Typography | Homepage uses a refined serif hero; collection/PDP use much heavier sans-serif headings and micro-labels. | Establish one hierarchy across the shopping journey while retaining campaign-specific expression. |
| Collection | Four-column desktop and two-column mobile layouts render without page-level horizontal overflow at tested widths. Mobile category strip scrolls horizontally. | Preserve useful product density; improve consistency and readable secondary labels. Filter and sort interactions were not exercised in this pass. |
| PDP, mobile | The 390×844 initial viewport contains image, title, price and quantity; the main Add to Cart is below the fold. | Review compact purchase summary and sticky purchase controls on representative devices. |
| PDP, after scroll | Extracted rendered text contains missing interpolation errors for increase/decrease quantity controls. | Fix the translation arguments in the working theme and inspect both visible and accessible labels. |
| Product information | Description still gives 20×20cm and 7×7 inches for the same item. Free-shipping copy does not explain a specific eligibility rule near the CTA. | Verify authoritative product dimensions and shipping rules before correcting content. |
| Footer | Custom SEO navigation and normal footer are both present, creating a long repeated footer. | Consolidate the presentation while retaining useful links. |
| Empty cart | Desktop cart has a large empty vertical area before its return-to-shop action. | Reduce empty-state height and give a useful route back to shopping. |

The previously identified Shop Bestsellers link points to the New Arrivals handle, but that destination currently renders as **New & Bestsellers**. This is a naming/merchandising alignment question, not a proven wrong destination. Do not change it solely because the handle contains `new-arrivals`.

## Sandbox: reusable work and actual gaps

### Category section

The active `category-test` section implements the independent category-colour model from earlier chats. Clicking each of four tabs on both viewport sizes resulted in one active panel and the correct distinct background: lavender, blue, pink and yellow. This requirement is implemented and reusable.

However, all tabs render **Category** and each active panel contains zero product links. The three carousel containers exist but content areas are empty. The independent carousel motion cannot meaningfully be validated until real images/products are assigned. The source exposes compact 16:10 banner controls. The larger app-style sticky mini-homepage design still needs reconciliation with this narrower section.

### Planner story

The sandbox uses `about-us-tes.liquid` with the final production CSS/JS assets. Scroll testing advanced the chapter label to Personal planning and displayed the correct imagery and copy. It is functioning as a sticky story, not a broken blank section.

It occupies **5800px** of scroll track at the desktop viewport and approximately **4895px** on mobile. Full-page screenshots show blank portions of a sticky scroll track and must not be interpreted as literal empty content seen throughout scrolling. Actual viewport captures show large empty space around the product, and the mobile copy sits very low in the viewport. Shorten/restructure this experience before incorporating it into the redesign. The Shopify preview bar covers part of the bottom of sandbox captures.

### Heartline campaign

Desktop retains the intended campaign composition and headline. At 390px, the pink product artwork visibly overlaps the headline, body copy and colour-choice area. The sticker also overlaps the CTA/utility region. This is a confirmed responsive composition issue; do not copy the section unchanged.

Only the Pink block has an assigned image in the saved sandbox settings; Turquoise and Black blocks have none. Their missing thumbnails are a configuration gap. Preserve the campaign concept and supplied image, but provide complete imagery and a separate mobile composition.

### Reviews and Instagram

The sandbox has the playful review-card treatment and wavy ticker. Review authenticity/source mapping has not been verified; do not treat editorially entered examples as verified customer reviews. Instagram section still renders the placeholder sentence “Share a short message below your Reel carousel.” Replace or remove it when integrating real content.

## Recommended first implementation

1. Use the new live-derived working theme as the implementation target.
2. Establish shared type, spacing, product-card and button rules; preserve existing native cart/GoKwik integration.
3. Build one compact department experience using the tested category switching logic, real department labels and collection mappings, and correctly configured banners.
4. Retain the planner images in a shorter section with clear navigation and visible copy/CTA.
5. Repair the Heartline mobile layout and complete the other colour images before including that campaign.
6. Consolidate footer and address confirmed PDP translation defects, then run buying-flow checks.

## Verification boundary

Ten route/viewport captures completed: live homepage, collection, representative PDP, empty cart, and sandbox homepage at each width. All returned HTTP 200 with the expected theme identity, no captured uncaught page errors, and no page-level horizontal overflow. Additional category clicks and planner scrolling were tested at both widths.

This is not checkout, populated-cart, discount, performance, full accessibility, or cross-browser certification. No orders, customer data, discount rules or product records were changed. Initial captures can show images still loading; no image-loading defect was inferred from those intermediate frames alone.
