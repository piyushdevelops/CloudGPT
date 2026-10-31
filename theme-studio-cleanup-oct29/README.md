# Photo studio theme setting cleanup, 29 October 2026

Prepared from theme `187527266499` after the generic photo-book product was archived and the hosted studio was updated to resolve occasion-specific variants at checkout. Shopify now reports that theme as `MAIN`. The connected Shopify write tool blocked the requested live-theme edit, so the approved cleanup was saved to an unpublished duplicate, theme `187625799875` (`Photo Studio cleanup — 29 Oct 2026`). The live theme was not changed.

## Scope

- `sections/june-photo-studio-page.liquid`: render the iframe whenever its builder URL is configured; pass the storefront URL and optional occasion/product deep-link parameters. Remove the archived product setting, generic variant map, and old product-variant fetch.
- `templates/page.photo-book-studio.json`: remove the archived `june-photo-book` product reference and its 22 stale variant IDs.

The two starting files exactly matched fresh Shopify Admin GraphQL reads (MD5 `cc163673d68011468f64562726dabbfb` and `781d3f24eb5623f5f7d484f3f8461967`). The local diff only changes the above logic/settings. The edited section schema and JSON template parse; `shopify theme check` returned `[]` when run against the two-file working tree with an empty `locales/` directory.

## Save and verification

The user explicitly authorized saving to MAIN, but `themeFilesUpsert` returned a `live_theme` block for that target. The current live theme was duplicated to an unpublished theme. Both files in the duplicate matched the pre-change hashes. They were fetched again immediately before upsert; 2/2 matched. The two-file upsert returned no user errors. Exact readback was 2/2, with final MD5 values `2b34deb6546191339028db7ff474411b` (section) and `d6788d1e4fb4a03b905a412706732d74` (template).

The storefront preview at `https://thejuneshop.com/pages/photo-book-studio?preview_theme_id=187625799875` passed a mobile embedded-browser check: the iframe URL has zero `variant_` parameters, the default Anniversary path resolves variant `54107700494531`, and switching to Travel resolves `54107699773635`, with no browser page errors. No theme was published. A merchant must publish the draft theme manually if this cleanup should go live.
