# Our Days Shopify package

Prepared 25 October 2026. The hosted landing page is deployed at `https://our-days-preview-production.up.railway.app`.

## Store structure

- Page: `/pages/our-days`, template `page.our-days`
- Product: `/products/our-days`, template `product.our-days`
- Collection: `/collections/our-days-memory-books`, template `collection.our-days`
- Product plans: 3 months ₹2,999; 6 months ₹4,299; 12 months ₹6,499
- Product is created as Draft and the page is unpublished for review.

The page section embeds the approved hosted experience and supplies Shopify store, product and variant URLs. Each plan button therefore opens the selected Shopify variant. The product page uses Shopify's native product form and carries `Journey: Our Days` as a line-item property into the order.

## Theme files

- `sections/june-our-days-landing.liquid`
- `sections/june-our-days-product.liquid`
- `sections/june-our-days-collection.liquid`
- `templates/page.our-days.json`
- `templates/product.our-days.json`
- `templates/collection.our-days.json`

These are isolated filenames. No shared layout, settings, locale, stylesheet, homepage or navigation file is changed.

## Launch state

After visual review, activate and publish the product/page, connect the collection or page to navigation, and run a real mobile checkout. WhatsApp prompting, customer accounts, project storage, proof approval and print production remain an application phase; the storefront must not promise those operational flows as live until they pass the launch gates in `rememberwhen-product-plan/README.md`.
