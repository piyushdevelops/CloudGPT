# PDP template audit — 23 October 2026

Read-only audit of unpublished Shopify theme `187527266499` and all 4,696 products. No product assignments or theme files were changed or published.

## Sources

- Shopify Admin GraphQL `theme.files` exact read of the product template names and contents on the unpublished theme.
- Shopify Admin GraphQL bulk product export (`products.jsonl`) of `id`, `title`, `productType`, `templateSuffix`, and `status`; operation `gid://shopify/BulkOperation/8229829181635`, completed 23 October 2026.
- Existing local product-brand and holistic-audit records for prior rendering observations; they are historical, not a substitute for new visual QA.

## Inventory

- 14 product JSON templates exist on the unpublished theme: default, `a_undated_planner`, `a_limited_undated_planner`, `a_wedding_planner`, `blackfriday25`, `bogo`, `champagne_heart`, `dated2026`, `feelgoodbox`, `mystery_box`, `mystery-box-v4`, `mysterybox`, `only_config`, and `preorderdated2026`.
- 3,307 products have no alternate template suffix (3,159 empty strings and 148 null values).
- 556 products have a suffix whose template exists in the unpublished theme.
- 833 products have an alternate suffix whose exact JSON template is absent from the unpublished theme; 217 of those are ACTIVE. This is an assignment/template mismatch requiring storefront QA before any reassignment. It does not by itself prove a broken rendered page.
- Four 2027 Dated Planner products are DRAFT and have no alternate template suffix: Create Your Magic, I Built Me, I am the Creator, and Do It Unmotivated. They are the clean pilot group.

## Current template use and recommendation

| Template | Assigned products | Active | Initial disposition |
| --- | ---: | ---: | --- |
| Default `product.json` | 3,307 no suffix | Many | Keep as the general goods baseline; redesign shared PDP shell carefully. |
| `a_undated_planner` | 77 | 75 | Keep as an existing planner reference; migrate after the 2027 pilot. |
| `a_limited_undated_planner` | 10 | 7 | Keep while offer/freebie differences are mapped. |
| `a_wedding_planner` | 32 | 10 | Keep until wedding-specific needs are mapped. |
| `blackfriday25` | 143 | 21 | Audit active products before retiring campaign styling. |
| `bogo` | 252 | 0 | Archive candidate only after checking three drafts and historical campaign reuse. |
| `dated2026` | 40 | 0 | Archive candidate; all 40 are typed Undated Planners, so inspect assignment history before reuse. |
| `champagne_heart` | 1 | 1 | Keep until this bundle/variant flow is represented in a shared family. |
| `mystery-box-v4` | 1 | 1 | Keep as a true special experience. |
| `feelgoodbox`, `mystery_box`, `mysterybox`, `only_config`, `preorderdated2026` | 0 | 0 | Do not delete yet; check integrations and preview links, then retire deliberately. |

The first two planner templates each use `main-product` plus several active custom-Liquid sections. Their current content and behavior must be extracted before consolidation; copying the large JSON files into new templates would multiply maintenance.

## Missing alternate suffixes

| Missing suffix | Products | Active |
| --- | ---: | ---: |
| `phone-2` | 355 | 125 |
| `kickstand-2-edition` | 153 | 26 |
| `doormat-runners` | 118 | 29 |
| `bathroom_mats` | 91 | 5 |
| `dinner-set` | 33 | 2 |
| `baby_record_book_jan` | 21 | 2 |
| `financial-planner` | 16 | 14 |
| `Default product` | 12 | 9 |
| `product` | 10 | 2 |
| `travel-journal-short` | 10 | 1 |
| `travel-journals-long` | 10 | 2 |
| `micro_freeze_dishwashsafe` | 2 | 0 |
| `baby-record-book` | 1 | 0 |
| `pixie-emoji-clock` | 1 | 0 |

## Three-phase execution

1. **Map and decide.** Inspect representative rendered PDPs for every active template and every active missing suffix. Make a feature matrix covering media, options, personalization, pricing, bundles, stock, delivery, FAQs, sticky CTA and cross-sell. Decide which category family each belongs to. Keep all assignments unchanged.
2. **Pilot 2027 Dated Planners.** Build a new `product.june-dated-planner` JSON template with reusable, merchant-editable sections and the approved palette/typography. Use real product data; require verified date range, page count, size, paper, inclusions, dispatch details and imagery before making those claims. Implement a working name input for `Add Name` and test line-item properties in cart. Pilot on one draft product, verify desktop/mobile/editor/cart, then assign the other three drafts.
3. **Roll out by category.** Consolidate undated/limited/wedding and broader goods into a small family set, preserving genuine offer differences. Handle Mystery Box and actual bundles as exceptions. Reassign in batches with before/after screenshots, cart checks and exact product/template readback. Retire old templates only after zero active products use them and integrations are checked.

## Immediate next design task

Create a PDP feature matrix from representative pages and design the 2027 dated planner page at desktop and mobile widths. The pilot starts as a local prototype/isolated section, then gets merged into the unpublished theme after fresh remote reconciliation. Three concurrent theme chats are active; no shared file is uploaded without overlap checks. No automatic publishing.
