# 2027 Dated Planner SEO — Step 1 Technical Audit

Audit target: unpublished theme `187527266499`, template `product.june_dated_2027`.

## Passed

- A canonical URL is rendered from `canonical_url`.
- The document title and meta description use Shopify's `page_title` and `page_description` values.
- Open Graph and Twitter metadata use the product's SEO title, description and featured image.
- The PDP has one primary product heading and server-rendered product content.
- The preorder date is visible on the page as `10 November 2026`.

## Issues found

1. The shared product schema reports preorder variants as `InStock` because Shopify considers continue-selling variants available.
2. The shared schema does not connect the two planner choices as variants of one product group.
3. `priceValidUntil` incorrectly uses `product.published_at`, which is not a price-expiry date.
4. All three images on the audited product have blank alt text.
5. Unique SEO titles/descriptions have not yet been applied across all 25 planner listings.
6. Both variants currently reuse SKU `TJS61800`; variant URLs remain unique, but unique merchant identifiers are preferable.
7. Products are still drafts, so storefront indexing, cart testing and sitemap discovery cannot complete until launch approval.

## Step 1 implementation

- Add a dedicated `ProductGroup` schema snippet only for `june_dated_2027` products.
- Emit each planner choice as a `Product` variant with its own URL and `Offer`.
- Emit `PreOrder` plus `availabilityStarts: 2026-11-10T00:00:00+05:30` when the exact campaign tag is present.
- Preserve the existing global schema for every other product template.
- Defer product-specific metadata and image alt text to Step 3 so the 25 listings receive unique copy rather than duplicated defaults.

## Launch-only gates

- Publish products to Online Store.
- Test an actual preorder cart and order.
- Validate a live URL in Google Rich Results Test.
- Submit sitemap and priority URLs in Search Console.

Nothing in this step publishes the theme, products, collection or articles.
