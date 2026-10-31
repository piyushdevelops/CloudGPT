# Step 8 — 2027 planner launch gate

Status: 2027 dated planner launch completed on 28 October 2026. Products, collection template, preorder storefront behaviour, Flow tagging and supporting articles are live. Merchant Center feed work remains dependent on the Google & YouTube channel connection.

## 28 October launch completion

- Shopify Flow is active on `Order created`. It checks `Order.lineItems.product.tags` for `June-Preorder-2027` and adds order tags `Pre-order` and `Pre-order-2027`.
- All 25 products have the exact campaign tag, product template suffix `june_dated_2027`, active status and a live Online Store URL.
- All 50 variants use inventory policy `CONTINUE` and were reported available for sale, allowing zero-stock preorder checkout.
- The collection now uses template suffix `june_dated_2027` and retains the approved SEO title and description.
- An isolated cart/checkout test passed without placing an order. The checkout retained `Purchase type: Pre-order`, `_Pre-order campaign: June-Preorder-2027` and `Expected dispatch: Expected dispatch by 10 November 2026.`
- Live desktop and mobile PDP renders passed for `Come On Baby Light Your Fire — 2027 Dated Planner`.
- The first live collection render exposed visible raw `@font-face` declarations. The collection section now wraps those declarations in `{% style %}`; the fix was applied to live and unpublished themes and exactly read back.
- Three SEO guides were published in `TJS Blogs`, all return HTTP 200 and link to the 2027 collection.
- A merchant-editable `Your 2027 planning guide` panel now links those three guides from the collection. It passed Liquid validation, live rendering and exact readback on live and unpublished themes.
- Canonical and structured-data QA passed on all 25 PDPs: each self-canonicalizes, exposes a `ProductGroup` with two variant offers, uses `https://schema.org/PreOrder`, sets `availabilityStarts` to `2026-11-10T00:00:00+05:30`, and matches the visible preorder/dispatch copy.
- The collection and all three guides self-canonicalize correctly.
- All 25 PDP URLs are already present in `sitemap_products_4.xml?from=14951558414531&to=14951638663363`. Shopify's root sitemap index and article sitemap had not refreshed at the time of the final check; recheck before Search Console submission.
- Final collection section checksum on both themes: `E1533B90F49ADA2DEDE45DA1F4A16378924557ED75BD8614619BD62BB054952E`.

## 28 October scoped live-theme sync

- User confirmed the exact scoped sync to live theme `142259323075` (`TJS August 2026 (Primary Theme)`).
- Seven approved 2027 planner files were uploaded with `--nodelete`; no other live-theme files were included.
- The six dedicated template/section/snippet files were copied from unpublished theme `187527266499` after a fresh pull.
- The current live `snippets/structured-data.liquid` was freshly pulled and received only the `june_dated_2027` conditional render hook; its existing product structured data was preserved as the fallback.
- A pre-upload overlap check confirmed the shared live snippet had not changed after it was fetched.
- Exact post-upload readback passed 7/7. Four Liquid files matched their source checksums exactly, both JSON templates were semantically identical after Shopify normalization, and the shared snippet matched the intended merged body.
- No theme was published, no product or article status changed, and no collection template was assigned during this sync.

## Earlier 28 October launch attempt

- The collection SEO title and description were applied and exactly read back.
- At that time, live theme `142259323075` (`TJS August 2026 (Primary Theme)`) did not contain the 2027 product template, product sections, collection template, collection section, or dedicated structured-data snippet. This blocker is now resolved by the scoped sync above.
- Unpublished theme `187527266499` contains all seven required files.
- The collection template suffix remains unset so the public collection does not request a missing live template.
- All 25 products remain `DRAFT`; all three articles remain unpublished.
- No live theme files were overwritten and no theme was published.

## Verified now

- 25/25 products are `ACTIVE` and have Online Store URLs.
- 25/25 products use template suffix `june_dated_2027`.
- The collection handle is `2027-dated-planners`.
- The collection uses the new `june_dated_2027` collection template.
- Collection SEO title: `2027 Dated Planners | Personalised Planners | The June Shop`.
- Collection SEO description: `Shop The June Shop’s 2027 dated planners with monthly and weekly layouts, habit tracking and optional name personalisation. Pre-order for 10 November dispatch.`
- Three supporting articles exist in `TJS Blogs` and are published.
- The unpublished theme remains `187527266499`. The seven approved files are now also present on live theme `142259323075`; the theme itself was not republished or switched.

## Launch checklist status

1. Complete — representative desktop and mobile PDP visual QA.
2. Complete — collection template and collection SEO.
3. Pending merchant connection — Google & YouTube / Merchant Center.
4. Complete — 25 products active with Online Store URLs.
5. Complete — Flow condition/output verified and isolated checkout handoff passed.
6. Pending merchant connection — Merchant Center `preorder` plus `availability_date=2026-11-10T00:00:00+05:30` for 50 variants.
7. Complete — three articles published and linked from the collection.
8. Pending explicit navigation placement approval — collection is live but was not inserted into shared header/homepage navigation.
9. Complete — Product/ProductGroup data, canonical URLs, visible prices and preorder dates passed across all 25 PDPs.
10. Pending sitemap propagation/Search Console access — product sitemap is populated; root index and article sitemap refresh are still pending.

## First 72 hours after launch

- Check Search Console indexing and enhancement reports.
- Check Merchant Center diagnostics for price, availability and identifier mismatches.
- Confirm product pages return 200 and no draft/404 links appear in articles or navigation.
- Watch add-to-cart, checkout and preorder-tagging events.
- Change nothing from preorder to in-stock until inventory is genuinely sellable.

## Remaining external dependency

Google & YouTube / Merchant Center setup still requires the merchant's connected Google account before feed-specific `preorder` and `availability_date` work can be completed. No paid test order was placed.
