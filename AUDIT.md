# Initial source audit — 2026-09-24

This records the initial read-only configuration/source audit. The subsequent visual audit and unpublished working-theme setup are documented in [VISUAL-AUDIT.md](VISUAL-AUDIT.md).

## Inventory

543 filenames returned; API pagination exhausted: 67 assets, 139 blocks, 2 config files, 2 layouts, 3 locale files, 153 section files (including section-group JSON), 126 snippets, 51 templates. Twenty-one selected source files were saved under `baseline/`.

## Findings

| Finding | Evidence | Implication / next action |
| --- | --- | --- |
| Homepage CTA label and destination handle differ | `templates/index.json`, hero: primary label Shop Bestsellers, link `shopify://collections/new-arrivals` | Subsequent browser inspection shows that destination is titled New & Bestsellers. Treat this as naming alignment, not a proven wrong link. |
| Featured carousel contains inconsistent price/discount presentation code | `carousel-focus.liquid` has a stale 50% display-price comment and hard-coded saving percentage, but actual price formulas use `times: 1`; comparison price also uses the same selling price | Inspect rendered price/strikethrough and quick-view output. The homepage sale badge is disabled. No half-price calculation or checkout mismatch is established by this code. |
| App-style category mini-homepages are not wired into current homepage | The five active homepage sections are listed in PROJECT-BRIEF; exact historical `tjs-collection-worlds.liquid` filename is absent from the full inventory | Reconcile historical design with current modules before rebuilding. Renamed/equivalent code elsewhere has not been exhaustively ruled out. |
| Planner Story differs from currently active planner module | Historical task reports `about-us-tes.liquid` work in a sandbox; current homepage uses `collection-mini-swipe` | Inspect sandbox and references before choosing which design to preserve. `about-us-tes.liquid` exists in live inventory but is not wired into homepage JSON. |
| Multiple cart implementations exist as files | Three `tjs-global-cart*` assets and `tjs-side-cart.liquid` exist; system group enables native `cart-drawer` | File presence does not mean all controllers execute. Trace actual loading and event listeners before modifying cart behaviour. |
| Active custom product sections have their own add-to-cart handlers | `card-deck.liquid` and `carousel-focus.liquid` call Cart Ajax endpoints and dispatch refresh/update events | Test with the enabled drawer and GoKwik; avoid adding another controller blindly. |
| Two footer layers are configured | Custom SEO footer followed by regular footer in `footer-group.json` | Assess duplication and mobile length visually; retain useful navigation/content. |
| Default PDP has disabled alternative modules | `pdp-3`, tabs, related and recently viewed sections are disabled in `templates/product.json` | Do not count their source presence as published functionality. Audit nested blocks/custom Liquid before concluding information is missing. |
| Header contains seasonal search suggestions | `my-header` settings include Rakhi Gifts / Gifts for Sister | Review current merchandising intent; not automatically an error. |

## Checks completed

- Shopify Admin queries validated against the discovered schema before execution.
- Connected live theme identity and source access verified.
- Full filename inventory retrieved without remaining pages.
- Selected JSON templates/groups parsed and active/disabled sections mapped.
- Source evidence saved locally, along with historical user requests and assistant reports.

`config/settings_schema.json` includes syntax that strict JSON parsing rejects (a trailing comma near the currency settings). It was preserved as returned rather than silently reformatted. This audit does not infer a Shopify Theme Editor failure from a strict parser result alone.

## Next verification

Capture desktop/mobile homepage, collection, representative PDP and cart states. Check actual font rendering, sticky header/tab stacking, CTA destinations, independent carousel gestures, category colours, image cropping and reduced motion. Verify price/comparison presentation against real selling prices, discount eligibility and checkout totals in an appropriate test flow. Reconcile the older sandbox before preparing the unpublished redesign.
