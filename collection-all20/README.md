# Collection page: all 20 improvements

Installed on unpublished Shopify theme `187527266499` on 9 October 2026. A colour follow-up was installed the same day. Nothing was published to MAIN.

## Scope

- `sections/collection-new.liquid`: stronger collection heading, intro, result count, prioritized product-type tabs with a scroll cue, underlined active tab, sticky filter/sort controls, refined filter chips and drawer, live drawer result count, mobile sort layout, responsive product imagery and option chips, honest review scores, a dynamic type editorial card, load progress, and product-return scroll restoration.
- `templates/collection.json`: matching merchant settings, type priorities and editorial defaults; prior typography controls retained.
- Existing type-based filtering, sort, variant selection and AJAX pagination remain in place.
- Colour follow-up: the collection now consumes the June master palette when enabled. The section has a **Use June master palette** switch that restores its own colour pickers when off. All collection surfaces and accent text use section-scoped roles, including the drawer, badges, active filters and sticky controls. The editorial feature defaults to a dark panel, with a soft-surface option. Small accent labels and discount percentages use a darker accent mix for contrast on pale palettes.

## Remote readback

Both files were fetched fresh immediately before each write. Only these two changed files were uploaded. Final remote content matched the intended local content byte for byte through the Shopify API:

| File | Remote MD5 | Exact match |
| --- | --- | --- |
| `sections/collection-new.liquid` | `a3872b2168a9e58d48a79e62cc78ea41` | yes |
| `templates/collection.json` | `428b77e7c3fca6c699b4d3aad3a3d7ca` | yes |

## Checks

- Shopify accepted both file writes and returned no user errors.
- Template JSON and section schema parsed. Extracted section JavaScript passed `node --check`.
- Headless Chrome preview at 1440 × 900 and 393 × 852: no page errors or horizontal overflow; 24 starting cards; visible type priorities; working sticky controls and filter drawer; live filter count resolved to 13; Undated Planners tab updated heading and URL; Load more increased cards from 24 to 48.
- Repeated desktop/mobile preview after the colour follow-up. The current custom lavender palette reached the collection, dark editorial panel and filter drawer. The initially pale discount text was corrected and visually rechecked at mobile width. The global palette settings were not changed.
- Screenshots: `desktop-top.png`, `mobile-top.png`, `desktop-editorial.png`, `mobile-editorial.png`, `desktop-filters.png`, `mobile-filters.png`.
- `check-preview.cjs` reproduces the browser checks. Physical iPhone Safari and Shopify theme editor visual review remain to be done.

The local `current-theme` snapshot is older than these remote files. Fetch remote before any subsequent edit.
