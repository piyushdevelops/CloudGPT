# June Photo Books Shopify package

Prepared 25 October 2026. Installed on the unpublished Shopify theme and connected to stable production hosting. Nothing is published.

## Customer path

1. `/pages/photo-books`, `/collections/photo-books`, banners and category links open the marketing landing page.
2. Repeated `Create your photo book` calls to action open `/pages/photo-book-studio`.
3. The studio starts at Occasion, saves drafts locally, prices Regular and Large books, exports a designed PDF and hands the chosen variant to Shopify cart.
4. The draft product uses the `photo-book` template and sends customers into the studio rather than bypassing design.

Employee order handling and the current manual design-file procedure are documented in [EMPLOYEE-ORDER-SOP.md](EMPLOYEE-ORDER-SOP.md).
The required Cloudflare R2 storage, Google Drive archive, dual-PDF rendering and printer handoff are documented in [DESIGN-HANDOFF-ARCHITECTURE.md](DESIGN-HANDOFF-ARCHITECTURE.md).

Google Drive and Railway credential setup is documented in [GOOGLE-DRIVE-CREDENTIAL-SETUP.md](GOOGLE-DRIVE-CREDENTIAL-SETUP.md).

## Resources prepared

- Draft product with 22 Regular/Large and 20–60 page variants.
- Automated Photo Books collection.
- Unpublished Photo Books landing page.
- Unpublished Photo Book Studio page.
- Landing, collection, product and studio templates and sections.
- Eight locally supplied photo-book/occasion assets.

## Validation

- New landing section and page/collection templates: Shopify Theme Check clean.
- Template JSON parses successfully.
- Landing page Admin mutation passed through the Shopify schema validator path (tool deferred validation to execution).
- Production builder is deployed at `https://june-photo-studio-production.up.railway.app`.
- Railway health, root document and image asset responses passed.
- Production browser QA uploaded 10 photos, restored all 10 after reopening, exported a 668,460-byte designed PDF, reached Shopify `/cart/add` with the selected variant and draft property, and found no page errors or horizontal overflow.
## Installed readback

Installed on unpublished theme 187527266499. Product remains Draft; both pages are unpublished. Shopify confirmed 16 theme files, 22 variants, collection membership and both template assignments. See final-readback.json. The later test install below added isolated files to MAIN without publishing the redesigned theme.

## Live-theme testing install — 25 October 2026

- The full redesigned theme remains unpublished.
- Eight isolated photo-book files were added to live theme `142259323075` (`TJS August 2026 (Primary Theme)`): four new sections and four new templates. No existing filename, shared layout, setting, locale, stylesheet or navigation file was replaced.
- Landing artwork uses the permanent Railway host, avoiding changes to the live theme's shared asset library.
- Exact remote readback passed for all four Liquid sections. Three JSON templates are semantically exact after Shopify formatting; the product template was normalized by Shopify to omit settings already supplied by section defaults.
- Authenticated mobile theme-editor previews passed for the hidden Photo Books landing page and Photo Book Studio. The landing shows the approved ₹2,799 / ₹3,099 starting prices and CTA; the studio loads the production builder without a rendering error.
- Both pages remain hidden and the product remains Draft, so this test install does not expose a new customer route or navigation item.


## Staging gate — 25 October 2026

- Direct editor checked at 393×852 and 1440×1000.
- No horizontal overflow at either viewport.
- Mobile Occasion, Cover and Pages states rendered correctly.
- Safe area and bottom page toolbar remained visible; Preview album no longer overlapped the canvas.
- Draft restored after reload, confirming local persistence.
- Browser console: no warnings or errors.
- Shopify landing and studio pages remain unpublished and therefore return 404 publicly, as intended.
- Full Shopify page rendering awaits authenticated theme-editor access.
# Authenticated visual QA — 25 October 2026

- Signed into Shopify Admin with the user-approved saved Piyush Jolly account and reviewed unpublished theme `187527266499` only.
- Verified the Photo Books landing template in desktop and mobile theme-editor previews. The 1100px tablet breakpoint keeps the hero headline and pricing cards composed inside Shopify's narrower desktop preview canvas.
- Found and repaired a draft-product integration gap on the Photo Book Studio page. Shopify storefront Liquid does not expose the selected product while it remains draft, so the studio section now accepts a merchant-editable fallback variant map and passes all 22 Regular/Large page-count variant IDs to the hosted builder.
- Exact remote readback passed for `sections/june-photo-studio-page.liquid` and `templates/page.photo-book-studio.json` after the repair. The target theme remains unpublished and MAIN was not modified.
- Verified the embedded builder in both desktop and mobile theme-editor previews. The iframe loads the Occasion screen and its URL contains `shopify_store` plus all 22 expected variant parameters.
- Browser logs contained Shopify Admin/editor warnings only; no builder error was reported.
- The temporary Cloudflare tunnel has been replaced with the permanent Railway URL. Exact Shopify readback confirmed the new host in `templates/page.photo-book-studio.json`.
- Remaining launch gates: publish/activate the draft product, landing page, studio page and navigation; publish the prepared theme; complete physical iPhone Safari checkout testing after launch.

