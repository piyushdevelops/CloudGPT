# Dispatch begins 10 November 2026

Saved to unpublished Shopify draft theme `187625799875` on 29 October 2026. MAIN theme `187527266499` was not edited. This draft also contains the earlier photo studio cleanup.

## Files changed

- `sections/june-mobile-product.liquid`: 2027 preorder default and schema dates changed from 31 October to 10 November; PDP and sticky button now say “Dispatches start from”.
- `sections/june-dated-collection.liquid`: collection status and SEO default now say dispatches start from 10 November; theme editor label updated.
- `templates/product.june_dated_2027.json`: the disabled legacy preorder section setting now uses the same wording.

Only these three files were uploaded. `sections/june-dated-details.liquid` and `snippets/june-pdp-card.liquid` were copied into `working/` solely to validate the partial theme locally.

## Verification

- Shopify CLI Theme Check: no diagnostics.
- Fresh draft comparison immediately before upload: 3/3 files matched the source snapshot.
- Shopify GraphQL exact readback after upload: 3/3 files matched the proposed text.
- Draft storefront HTML: [Create Your Magic 2027 PDP](https://thejuneshop.com/products/create-your-magic-2027-dated-planner?preview_theme_id=187625799875) returned HTTP 200 and displayed “Dispatches start from 10 Nov 2026” in both PDP locations.
- Draft [2027 dated planners collection](https://thejuneshop.com/collections/2027-dated-planners?preview_theme_id=187625799875) returned HTTP 200 and displayed “Dispatches start from 10 November 2026”.

The connected Shopify tool blocks edits to the live MAIN theme. Publishing or manually reconciling the draft remains a merchant action.
