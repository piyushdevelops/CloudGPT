# Photo Books + Our Days review sections — 26 October 2026

## Outcome
- Added image-led three-card review sections with five-star ratings to Photo Books and Our Days.
- Used the two user-supplied reference photographs plus existing product imagery.
- Launch copy is explicitly labelled as preview copy so unverified testimonials are not presented as real customer reviews.

## Photo Books
- Unpublished Shopify theme `187527266499`; nothing published.
- Updated `sections/june-photo-books-landing.liquid`, `templates/collection.photo-books.json`, `templates/page.photo-books.json`.
- Added `assets/june-review-family-book.jpg` and `assets/june-review-travel-books.jpg`.
- Review blocks are merchant-editable: image, fallback asset, rating, title, byline and quote.
- Mobile uses a horizontal snap carousel; desktop uses three cards.
- Exact readback hashes:
  - section `73CC1DB0F9C8DFC8E6F73D172155760EFAD8FB56B29656C2175F4366724537A6`
  - both templates `D300AED215DD67F4BCED4B84935CEE72E1F4F2BEBB83B03A7801171C70CDAC15`
  - family image `C7711A446177D18BF313CE9F4CC707857B08B6B69BC806C2E6119269E96C26B8`
  - travel image `4B73E2FDFF8C4B48FF8DE86B84976503D0AEBAF324F7510EC6736B9587A76A0F`

## Our Days
- Updated and deployed the hosted landing page from `our-days-landing/` to Railway service `our-days-preview`.
- Added matching image-led review cards and responsive carousel.
- Hosted HTML exact readback `A5C03136ECA2CEEDC92E0F2EFB31F656D885E3D1A6B2749823009EAF42B9A47C`; both hosted images matched local SHA-256.
- Updated Shopify iframe allowance so the added section, FAQs and closing CTA are not clipped: `sections/june-our-days-landing.liquid` readback `D2D29531BA155A8DF0993B053C50EF10E6370CFD39778E0F3A9FCC5C336D2C93`.

## Checks
- Fresh pre-write overlap checks passed for both remote systems.
- Shopify Theme Check reported no findings in changed files; unrelated existing theme findings remain elsewhere.
- Our Days responsive checks passed at 360x800, 390x844 and 1440x1000 without horizontal overflow.
- Both rendered review sections and all images were checked in fresh storefront sessions.
