# Vivid Orange / Bold Minimal — 30 September 2026

User selected option 20 for the entire theme. Installed on unpublished theme 187527266499; awaiting review. Nothing published; MAIN unchanged. Supersedes Apricot & Lilac and the cream gutter request.

| Role | Colour |
|---|---|
| Canvas and gutters | #FFFFFF |
| Ink / dark footer | #171717 |
| Primary actions | #F56A28 |
| Supporting surface | #F5F5F3 |
| Muted text | #656565 |
| Borders | #DADADA |

Orange uses dark labels. Homepage section surfaces are white; footer is black with white text. Shared schemes, header, photo viewer, collection controls, configured product templates and their embedded custom Liquid, Mystery Box styles and side-cart colour rules were updated. Existing scheme IDs, editable controls, typography, layout, copy, image URLs, product details and interaction scripts preserved. Natural colours baked into product/hero photographs remain. Semantic error/status colours and third-party/payment branding are preserved.

## Verification

- Fresh snapshots reconciled before both save rounds; no conflicts. 43/43 uploaded files verified by remote readback (semantic JSON / normalised line endings). current-theme synced from remote.
- All 12 June sections plus photo viewer passed Liquid/schema validation. Secondary custom files passed or had only the same pre-existing baseline findings: header/legacy-section setting counts, existing schema label, unused variable/complexity and missing dependencies in this partial snapshot. No new findings in baseline comparison. Do not describe the whole legacy theme as lint-clean.
- Non-colour JSON values and 68 top-level script blocks preserved. Product custom Liquid refinements alter style blocks only.
- Desktop homepage checked at 1440x1000. All 11 main section surfaces computed white with dark text; primary actions orange/dark. Footer computed black/white.
- Homepage, planner product and collection checked at 393x852 CSS viewport; no document overflow. Planner Add to Cart computed #F56A28 with #171717 text; title black.
- Existing sticky product quantity interpolation error observed again; unrelated to palette, not changed.
- Physical iPhone/Safari and every individual template were not exhaustively tested. Third-party checkout branding is outside theme-file control.

Snapshots: before.json, extra-before.json, assets-before.json; final-after.json is installed state. remote-checks.json is final reconciliation. changed.json lists upload scope. Scripts in tools/apply-vivid-palette.cjs and tools/check-vivid-palette.cjs are historical snapshot-based helpers; do not rerun on future merchant edits without a fresh pull.

[Draft preview](https://thejuneshop.com/?preview_theme_id=187527266499)
