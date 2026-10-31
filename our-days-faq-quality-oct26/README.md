# Our Days quality FAQ expansion — 26 October 2026

## Scope
- Updated the separately hosted Our Days landing page source at `our-days-landing/index.html`.
- Added three FAQ rows covering acid-free photo paper and matte lamination, long-term colour preservation and storage, and phone-photo print suitability/quality warnings.
- Shopify theme files were not changed; the existing unpublished Our Days template embeds this hosted experience.

## Concurrency and deployment
- Initial hosted HTML matched the local source exactly before editing.
- A second pre-deploy hosted readback matched the saved baseline exactly.
- Deployed to Railway service `our-days-preview`.
- Exact hosted HTML readback matched local SHA-256: `D83C44ECDCE3DE8817E8D1A0EE32109F856506862508B2F0F81281613CAD5AF0`.

## Checks
- Existing visual test passed at 360 × 800, 390 × 844 and 1440 × 1000 with no horizontal overflow.
- Mobile live page verified at 393 × 852; all new rows render and the materials answer expands correctly.
- No Shopify theme was published.
