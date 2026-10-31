# Cover-specific personalization — 27 October 2026

Implemented and deployed to the Railway-hosted June Photo Studio.

## Behaviour

- Replaced the generic title/subtitle screen with cover-specific required fields.
- Mapped all 62 current cover designs to their required Title, Subtitle, Name and/or Age fields.
- Added per-field character limits based on the available cover space.
- Added one to four required cover-photo slots per design.
- `Then & Now` requires Name (16 characters), Age (3 characters) and two cover photos.
- Customers can add any missing standard field or add their own labelled custom details.
- Added live cover preview overlays, validation, IndexedDB persistence and PDF/cart payload support.
- Added the customer promise that June completes the cover and inside pages after purchase and sends the full proof for approval before printing.

## Deployment

- Railway deployment: `9cf66d7b-cbed-4ab9-95af-e7c61b102b02`
- Status: `SUCCESS`
- Studio URL: `https://june-photo-studio-production.up.railway.app`
- Shopify theme was not published or modified for this change; the existing unpublished-theme iframe continues to load the Railway Studio.

## Verification

- Mapping integrity: 62 catalog covers, 62 mappings, no missing/extra/invalid records, one-to-four photo slots.
- Production personalization flow passed at 390px and 1440px.
- Required-field and photo validation passed.
- Two cover-photo uploads and preview rendering passed.
- Draft reload restored both uploaded photo blobs and customer fields.
- PDF generation produced a 2400 × 2400 cover.
- Cart payload includes personalization, cover-photo count and proof-approval note.
- Full Studio regression passed at 390px, 430px and 1440px; canvas remains 1:1 with no viewport overflow.
- Page reorder and forward/back layer-order regressions passed, including persistence.
- Unpublished Shopify page iframe bridge passed with product, occasion and variant routing intact.
- Exact production readback passed for `index.html`, `styles.css`, `app.js` and `cover-personalization.js`.

## Secure order handoff

- Checkout now waits for every cover and inside-page photo upload and writes the final cloud draft before opening Shopify cart.
- The line item carries a visible `Design reference` and private cloud design ID, plus personalization, proof requirement, cover and book configuration.
- A clear retry message prevents checkout when secure storage is unavailable, so an order cannot be accepted without its source images.
- Failure and success paths passed locally and against the deployed Railway build.
- Railway R2 storage is configured and `/api/storage/status` reports no missing variables.
- A real production browser test uploaded two cover images through signed R2 URLs, saved the final draft, and produced a cart handoff whose visible customer reference and private design ID matched the same R2 design.
- The real test found and fixed a simultaneous-upload race by making cloud-design creation single-flight; both photo keys now resolve under one `photo-books/<customer>/<design>/originals/<asset>` prefix.
- Final real test reference: `C-20261027-8CD857`. This disposable test design remains in the private bucket because no destructive cleanup endpoint is exposed.

Nothing was published to the live Shopify theme.
