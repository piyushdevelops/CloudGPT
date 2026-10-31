# Step 5 — Google Merchant Center preorder setup

Status: prepared, not activated.

## Connection audit

- Shopify Admin does not currently show the Google & YouTube sales channel/app.
- The available marketing connector has Meta connected, but no Google Merchant Center account.
- All 25 planner products remain `DRAFT`, so no product data should be sent to Google yet.

## Required launch configuration

Use the Google & YouTube channel or an equivalent primary/supplemental feed with the following values for every 2027 planner variant:

| Feed field | Value |
| --- | --- |
| `availability` | `preorder` |
| `availability_date` | `2026-11-10T00:00:00+05:30` |
| `condition` | `new` |
| `brand` | `The June Shop` |
| `google_product_category` | `Office Supplies > Office Instruments > Paper Products > Planners` |
| `product_type` | `Planners > Dated Planners > 2027 Dated Planners` |
| `link` | Canonical Shopify product URL with the specific variant selected |
| `price` | Match the selected Shopify variant exactly |

The storefront and JSON-LD already state preorder availability and 10 November 2026 as the expected availability/dispatch date. Keep the date identical in Merchant Center.

## Unique item ID rule

Do **not** use SKU alone as the Merchant Center `id`. Each product's “Add Name” and “Without Name” variants currently share one SKU, so SKU-only IDs would collide.

Use the Shopify numeric variant ID as the feed item ID, or preserve the Google & YouTube app's generated variant-level ID if it is already established. Examples:

- Create Your Magic / Add Name: `54106359136451`
- Create Your Magic / Without Name: `54106359169219`
- Come On Baby Light Your Fire / Add Name: `54106753302723`
- Come On Baby Light Your Fire / Without Name: `54106753335491`

The source-of-truth query confirms 50 variants across 25 draft products. Prices are ₹2,099 for “Add Name” and ₹1,999 for “Without Name”.

## Activation order

1. Install/connect Shopify's Google & YouTube channel to the correct Merchant Center account.
2. Confirm that all 50 variant item IDs are unique before enabling sync.
3. Keep the 25 products draft while reviewing diagnostics.
4. At launch, activate/publish the products and set the feed fields above.
5. Verify the landing page shows the same price, availability and 10 November 2026 date for each selected variant.
6. After 10 November 2026, change `preorder` to `in_stock` only when sellable stock is genuinely available.

## Validation gate

Before approving the feed, check one personalised and one non-personalised variant for:

- unique item ID;
- correct variant URL and price;
- `preorder` availability;
- `availability_date` with India timezone;
- no missing-image or identifier warnings;
- agreement between Merchant Center, visible PDP copy and JSON-LD.

No Google account, product status, publication or feed was changed in this step.
