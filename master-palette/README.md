# June master palette — 30 September 2026

Installed on unpublished theme 187527266499 at the user's request. Nothing published; MAIN unchanged.

## Use

Open the draft theme editor → Theme settings → June master palette (first panel).

- Enable master palette switches central control on/off without deleting existing section colours.
- Presets: 20 Vivid Orange (original), Electric Blue, Signal Red, Apricot & Lilac, Custom colours.
- Select Custom colours to use nine pickers: page/gutters, secondary surface, main text, muted text, accent, button text, borders, dark panels/footer, text on dark panels.
- Custom picker values persist while trying presets. Pickers show saved custom values, not the active preset's values.
- June sections have Use master palette enabled by default. Switch off for the section's original colour controls. Hero control is inside its Typography controls block due to the 40-setting limit. Removing that block still inherits the master palette.
- Save affects only this unpublished draft. Publishing is a separate action and was not performed.

Final state: enabled, Vivid Orange selected, custom background restored to white. Editor left on master controls.

## Implementation

Global settings in config/settings_schema.json. snippets/june-master-palette.liquid resolves presets/custom colours and emits CSS role variables plus native colour-scheme channel overrides. Layout renders it after existing css-variables. June sections, header, viewer, side cart, Mystery Box, collection styles and existing custom Liquid product content consume role variables with original-colour fallbacks. Section opt-outs invalidate inherited role variables locally. Existing settings remain intact. Typography, imagery, URLs, price logic and interaction scripts were not changed.

Preset labels use independent button-text colours: dark for orange/apricot, white for blue/red. Dark arrow circles use the dark-panel/text roles. Existing semantic status/error/sale colours, photographic colours, payment marks and third-party checkout remain separately controlled. Neutral physical shadows retain their original opacity/colour.

## Verification

- Fresh remote reconciliation before writes and refinements; UNPUBLISHED role confirmed. Final 31 code/config/template files matched remote readback. Two editor-saved/read-only state files captured too (33 total reconciled); current-theme synced.
- New master snippet, all 12 June sections and photo viewer passed Liquid checks. Legacy settings/schema/partial-snapshot findings match baseline; no new lint errors. Do not claim the full legacy theme is lint-clean.
- Editor UI: panel, enable toggle, preset selector, all nine pickers visible. Electric Blue updates homepage buttons to blue with white labels. Apricot & Lilac changes page canvas and surfaces. Custom test #EFF7F2 reached page background/gutters and section backgrounds; restored #FFFFFF afterward.
- Global disable restores original section colours. Section 2 opt-out restored its orange button while hero stayed blue; re-enabled afterward.
- Saved blue briefly on the draft for cross-page testing, then restored/saved orange. Product Add to Cart and sticky Add to Cart both blue/white. Mobile product, collection, homepage checked at 393x852 CSS viewport without document overflow. Desktop editor checked. Physical iPhone Safari not tested.
- Vivid Orange final state verified through saved config readback and refreshed mobile homepage. No outstanding test colours/disabled overrides. Existing stale-session Restore notification was not used.

Evidence: before.json, after.json (initial upload), final-after.json (final remote state), remote-checks.json, validation.json, baseline-validation.json, corner-validation.json, master-settings.png, mobile-home-final.png, mobile-product-blue.png, mobile-collection-blue.png.

tools/build-master-palette.cjs is a one-time snapshot-based migration helper. Do not rerun it against future merchant changes; pull fresh files and merge deliberately.
