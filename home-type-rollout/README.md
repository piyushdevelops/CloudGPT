# Approved homepage typography rollout — 5 October 2026

User approved the Undated typography, price, selected-tab, policy-link and Zoom in refinements and requested a full homepage sweep. Implemented in unpublished theme 187527266499 only. Nothing published; MAIN unchanged.

## Master controls and future standard

Theme settings → **June typography** controls prices, actions/navigation, supporting copy and eyebrows. **June typography utilities** controls reassurance/captions and the viewer label. Each role has font family, weight, desktop/mobile sizes, tracking and leading.

Defaults: Archivo Black prices 34/30px with smaller ₹ for INR; Poppins700 actions15/14px; supporting Poppins500 15/14px; labels Poppins700 12/11px; reassurance Poppins500 13px. Small From labels stay separate. Other currencies retain Shopify money formatting.

The 12 June sections opt into the system by default. Disable “Use approved master typography” to return to the saved section controls; hero toggle is in its Typography block. Header navigation inherits the master system. Global disable is also available. Headings, subheadings, Anton Glassware exception, palette, artwork, product mappings, stage heights and scene sequence were not intentionally changed. The stylesheet is loaded on the homepage only; this task does not restyle product/collection templates.

New homepage work must reuse these roles, the june-price snippet and the shared photo viewer. Do not add isolated fixed Rs. labels or tiny underlined photo links. Product actions lead, comparison/collection actions follow, policy reassurance comes last. Accent selector treatments apply to page/layout controls; image swatches and approved Glassware selectors retain their established composition.

## Batches and ledger

| Batch | Change | Source gate | Rendered gate | Saved draft gate |
|---|---|---|---|---|
| Foundation | Two settings groups, font loading, homepage stylesheet, currency helper, viewer default label | New snippets validate; legacy config missing-label issue matches baseline | Computed fonts/sizes verified; editor displayed fonts and role controls | Exact readback |
| 1 | Hero, Undated, Limited,2027,Inside Discovery,Other Chapters | All six sections validate; root-scope error found and corrected | Shared fonts; mobile cover/page switching; hero tab height662px matched; no overflow | Exact readback |
| 2 | Décor,Lighting,Glassware,Dining,Mystery Box | All five sections validate; original product/data logic preserved | Product switches in Lighting/Glassware/Dining, prices, Dining viewer; no overflow | Exact readback |
| 3 | Header and footer | Footer validates; header's existing43-setting lint issue retained, no new complexity finding after correction | Header links15px; search open/close at narrow mobile; footer15px; signup action/required inputs intact | Exact readback |

## Checks and evidence

- Final19/19 changed files matched exact remote text, role UNPUBLISHED: final-readback.json. All synced to current-theme.
- Final12 June sections +3 snippets passed validation: validation.txt. Legacy settings_schema missing label and header43-settings findings were reproduced against before files. Full legacy layout was not declared lint-clean.
- DOM/layout checks at1440x1000,393x852,430x932 and374x666. The current browser zoom/integer viewport combination yields374x666 rather than exact375x667. No physical iPhone test.
- No page horizontal overflow at tested widths. Mobile price30px; primary/shared action sizing retained. Search email fields at least16px. Selected mobile utility/tab controls checked for44px targets in prior approved sample and rollout.
- Header search opens/closes; hero Undated/Life tabs hold the same stage height. Limited first/last covers and Inside Discovery last tab checked. Lighting third product, Glassware first/third and Dining first selection checked. Dining photo viewer opens/closes. No real signup submitted or orders placed.
- Editor showed Draft, disabled Save and new typography controls. Utility control grouping was adjusted after inspection so a role stays together.
- Screenshot capture remains unreliable. desktop-preview.png contains a successful wide viewport capture showing the planner type hierarchy. planner-desktop.png is an incorrectly framed capture and must not be treated as section-comparison proof. Complete per-section desktop/mobile visual comparison and physical-device checks remain incomplete. A final exhaustive selector loop timed out; do not claim every selector was checked in that loop.

## Preserved limitations

Existing Glassware image/product mismatch and other historical catalog-artwork issues are unchanged. Typography approval does not resolve those content issues. No new reviews, claims or policies were invented.

## Files

19 changed files listed in changed.json:12 June sections, header, layout, settings schema, shared CSS, font snippet, price snippet and photo viewer. No templates/index.json or settings_data.json write was performed. Fresh before.json and baseline/ preserve remote state at start. Build scripts are snapshot migrations, not reusable deployment commands; do not rerun against newer merchant edits.
