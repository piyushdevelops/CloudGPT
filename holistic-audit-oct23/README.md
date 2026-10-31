# The June Shop draft theme — holistic audit

**Checked:** 23 October 2026. **Theme:** unpublished `187527266499`. No theme files were changed or published.

## Coverage and method

- Loaded 19 representative URLs at desktop `1440×900` and mobile `393×852`: home, four collections, four product types, five support/content pages, search, empty cart, blog, article and 404. Rechecked nine core URLs at `320px` and `768px`.
- Inspected the homepage at several scroll positions on both desktop and mobile; inspected the collection, product, story, contact, FAQ and cart visually.
- Exercised collection price sorting, a metafield filter and its Apply action, filter drawer keyboard dismissal, and the glassware bundle add-to-cart. Read the resulting cart data without starting checkout.
- Sampled 51 internal header/footer links. Forty-seven returned successful responses. Three returned `429` during the rapid scan and account returned `406`; those four are **inconclusive**, not confirmed broken links.
- This is a template and shopping-path audit, not an individual review of roughly 2,148 product URLs or a physical-device/Safari sign-off. Shopify's draft preview bar covers the bottom of mobile screenshots; it was hidden temporarily in the browser for the filter Apply test.

## Findings, in fix order

| Priority | Finding | Evidence and recommended action |
| --- | --- | --- |
| P1 | **Our story is image-only.** Four images contain the page's wording, but the page has no HTML heading or body text and every story image has empty alt text. On mobile the embedded copy is tiny. | [Mobile screenshot](mobile-story.png), [DOM result](interaction-results.json). Rebuild the copy as real text with an H1 and responsive layout; retain photos as media. |
| P1 | **Sticky header obscures content and controls while scrolling.** The header stays transparent over text and interactive tabs in homepage sections; the Explore label can overlap underlying section labels on desktop. | [Mobile section](mobile-home-4.png), [desktop section](desktop-home-5.png). Give the sticky controls a reliable surface/clearance and test scroll transitions at common widths. |
| P1 | **Product quantity buttons emit translation errors.** The rendered button text literally says `I18n Error: Missing interpolation value "product"` for increase/decrease on the planner, glassware and bath product templates. | Confirmed in DOM on three product URLs. Pass the product name into the translation or use a valid localized fallback; check the accessible names after rendering. |
| P2 | **The filter drawer does not close with Escape.** It remains on screen at the same position after Escape on mobile; the close button is present. | [Flow result](flow-results.json) and direct bounding-box check. Add Escape dismissal and return focus to the Filters trigger. Filter selection and Apply otherwise worked. |
| P2 | **Planner product has horizontal overflow on narrow phones.** The La Vie Est Belle page is 324px wide at 320px and 397px at 393px. Other checked pages stayed within the viewport. | [320px result](secondary-results.json), [393px result](page-results.json). Correct the four lower custom sections previously traced to viewport width + 8px, then verify 320–430px. |
| P2 | **Support/content templates lack a page H1.** Contact, FAQ, Our story, Shipping and Returns have no H1 in the main content at 320/393/768/1440px. | [Cross-width results](secondary-results.json). Add one clear heading per page and use the approved type system. |
| P2 | **Contact page offers no direct action.** It has registered office, phone and email text, but no contact form, `tel:` link or `mailto:` link in main content. | [Contact result](interaction-results.json), [mobile screenshot](mobile-contact-top.png). Make phone and email tappable and decide whether a short message form belongs here. The footer uses `help@thejuneshop.com` while the page shows `sales@thejuneshop.com`; clarify the preferred support address. |
| P2 | **Bundle cart presentation is confusing.** The selected “Set of 4” adds two packs of 2. Its card and drawer show ₹1,798, but the cart API total is ₹1,798.20 after a ₹199.80 automatic discount. The data represents two lines of the same variant with different final prices; the drawer first view shows one row while its header says 2 items. “You save ₹3,000” is based on compare-at prices, a different basis from the automatic discount. | [Cart data](cart-results.json), [drawer screenshot](mobile-cart-drawer.png). Align the displayed total with the charge, present one clear “Set of 4” line or explain the breakdown, and label the savings basis. Do not alter the bundle price without merchant review. |
| P2 | **Palette and legacy templates are inconsistent with the documented brand direction.** The draft currently shows lilac controls and product/cart accents even though the project record names Vivid Orange `#F56A28` as the selected master palette. Empty cart, contact and FAQ still use generic/older layouts while the homepage and collection use the newer June typography. | [Empty cart](mobile-cart-top.png), [FAQ](mobile-faq-top.png), [collection](mobile-newCollection-top.png). Reconcile the current merchant selection in theme settings first, then route these templates through the approved palette and type controls. Other concurrent chats may have intentionally changed the selection. |

## What passed

- All 18 expected representative URLs returned HTTP 200; the deliberate missing URL returned 404.
- No page JavaScript exceptions, missing `alt` attributes, or visibly broken image loads were found in the sampled first views. Empty alt on the story images is a separate content/accessibility issue.
- The collection price sort changed the URL to `sort_by=price-ascending` and showed ₹299 products first on both desktop and mobile.
- Applying “Home Styling” added the expected filter URL parameter and reduced the visible cards to eight. The preview bar had to be hidden in the test browser because it covered the draft drawer's bottom button.
- Bundle add-to-cart reached the cart; the ₹0.20 display mismatch above needs resolution. Checkout/payment was not attempted.

## Suggested implementation sequence

1. Repair the story content and product translation labels.
2. Fix sticky header clearance, mobile planner overflow, and filter drawer keyboard behavior.
3. Reconcile current palette settings with the approved direction, then bring cart and support pages into the same typography/colour system.
4. Clarify bundle presentation, add support-page headings and contact actions.
5. Re-run desktop/mobile visual and interaction checks, then test on physical iPhone Safari before considering publication.

Because three chats are editing this theme concurrently, fetch and reconcile each remote file immediately before any future write; upload only scoped files and perform exact readback. This audit made no remote writes.
