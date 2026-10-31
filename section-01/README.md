# Section 01 — Make Room

Built in unpublished theme **187527266499**. Live theme **142259323075** was not changed.

Preview: https://thejuneshop.com/?preview_theme_id=187527266499

## Changed files
- `sections/june-make-room.liquid`: custom hero, responsive art, four accessible tabs, Mystery Box link and Shopify customer form.
- `locales/en.default.json`: added `june_hero` translation keys; existing keys preserved.
- `templates/index.json`: inserts `june_make_room` first and disables (preserves) the previous `home_banner_swiper_gPUxE8` hero. Other homepage sections and global header stay as they were.

## Theme Editor
Open homepage → **June · Make Room**. Copy, colours, display font, desktop minimum height, mobile artwork height, collections, Mystery Box product and three Life Journal blocks are editable. Real product images are the default; optional image-picker overrides or complete desktop/mobile artwork replace them. Interior image number is one-based; current selection is image 10 of Serendipity. The crop switch is tailored to the existing catalog photograph; turn it off for a custom isolated interior image.

Default products: Serendipity and Quiet The Mind undated planners; Dolce Far Niente in the Limited Edition tab. Exact catalog artwork is used, not the generated reference covers. The global header is outside this section's scope.

## Behaviour
- Undated opens by default. Tab click/arrow keys/Home/End switch one panel at a time.
- With JavaScript unavailable, links still navigate to collections and all panels are displayed.
- 2027 stays coming soon. Its customer form uses tags `newsletter,2027-planner-launch`. No preorders or unreleased product images.
- The form collects launch-interest contacts. It does not create or schedule the launch email campaign. Delivery automation and post-submit confirmation require a controlled end-to-end check before launch; no test contact was submitted during this build.
- Life Journals links to verified Wedding, Rewritable and Baby collections. Mystery Box points to `mystery-box-limited-drop`.
- No autoplay, particle animation or external JS library.

## Validation and review
Shopify Liquid/theme validation passed. Browser evidence in this folder checks 1440, 750, 390 and 320px widths, image loading, tab states, keyboard movement, empty email validation, no page exceptions and no horizontal overflow. Screenshots are actual unpublished-theme renders. Generated review boards remain design references, not final-product assets.

## Rollback
Restore `before/templates/index.json` to the same unpublished theme. This removes the new hero from the homepage and restores the old one. Previous locale contents are in `before/locales/en.default.json`. New section can remain unused. Never publish or write the MAIN theme as part of rollback.

## Depth refinement — 25 September 2026
CTA buttons now have 6px corners, a restrained raised edge and pressed state. Mobile secondary CTA has matching soft corners. The open planner has 7px corners, layered paper-edge shadows and a subtle rim highlight. Liquid validation revision 6 passed; desktop/mobile screenshots and browser checks refreshed at 1440, 750, 390 and 320px. Only the custom section file was updated on unpublished theme 187527266499. Pre-change section saved in `before/june-make-room-before-depth.liquid`.

## Reference composition refinement — 25 September 2026
Four visual iterations at 1440, 750, 390 and 320px: increased condensed headline presence; stacked mobile heading; enlarged and exposed upright covers; placed open spread below in perspective; layered paper-edge shading; diagonal warm lighting. Preserved the merchant image/font settings and all tab behaviours. Only the section Liquid file was deployed to unpublished theme 187527266499; checksum 2c3ced61dd29c9afa49a0980883c5805. Liquid validation revision 8 passed. Preview cache marker jh_review=5 confirmed deployed styling. Browser checks and screenshots refreshed. Source section backed up in before/june-make-room-before-composition.liquid.

Remaining reference difference: actual catalog covers/interiors differ from the generated reference. Reviewed all 40 Serendipity images; interiors are flat layouts, not angled photography with curved pages. The CSS composition is closer but is not an exact photographic match. Global header remains outside this custom-section scope.

## Typography controls — 25 September 2026
Display family and existing heading size controls remain in section settings. A dedicated Typography controls block provides text font (optional override of Arial), desktop/mobile sizes, weight, letter spacing and line spacing for headings, subheading, supporting text, eyebrow, buttons/links and navigation. Font weights are loaded using font_modify when supported by the chosen family. Missing block falls back to the existing section styling. Life links remain limited to three. Typography block selection does not activate the Life tab. Liquid/template validation revision 11 passed. Future sections must follow the project AGENTS.md typography requirement.

## Uploaded planner composition — 25 September 2026
Merchant assigned home_page_image.png to both desktop and mobile image pickers. Verified original 1217×1293 artwork. Section now sizes complete artwork naturally on mobile, reserves mobile source dimensions, and adds a subtle shadow. Restored the Typography controls block absent from the newly saved template, preserving merchant image assignments and copy changes. Backups: before/upload-sections-june-make-room.liquid and before/upload-templates-index.json. Validation revision 12 passed.

Image review also fixed font_modify weight coercion (weights are now strings with a family-checked fallback). Validation revision 13 passed; rendered Oswald font-face verified. Preview marker uploaded4.

## Wide desktop scene — 25 September 2026
New merchant asset ChatGPT_Image_Sep_25_2026_04_46_21_PM.png (1997×788) is used as the desktop scene behind editable text. New desktop_scene checkbox enables this layout at widths over 1050px. The existing portrait home_page_image.png remains assigned to mobile and tablet, preventing a narrow crop of the wide scene. Typography controls remain intact. Validation revision 14 passed. Before files are prefixed scene- in before/.
Desktop scene setting was reapplied after schema deployment because Shopify dropped the new field in the initial combined write. Read-back confirms desktop_scene=true. Final desktop screenshot shows full-width lighting scene behind editable copy. Preview marker scene3.

## Reference typography system — 25 September 2026
Replaced condensed/scaled Oswald display with natural-width Poppins 900 and sentence-case Make room. Text uses Poppins 400 with configurable safe bold emphasis (big plans.). Shared type roles and future-section guidance are recorded in ../TYPOGRAPHY.md and ../AGENTS.md. Primary CTA is an editable lime capsule with black circular SVG arrow; secondary actions are text links with circular arrows. Font controls remain available; heading size sliders now directly control natural font sizes rather than the old artificial scale. Defaults updated for new section instances. Backups: before/type-refresh-*. Validation revision 15 passed. Computed-style check confirms Poppins 900 loaded, transform none, 999px button radius, 32px black arrow circle and matching emphasis. Browser tests at 1440, 750, 390 and 320px confirmed image loading, working tabs/keyboard and no overflow or page exceptions. Preview marker type3; screenshots are actual draft renders.

## Primary button and Mystery Box motion — 25 September 2026
Primary CTA hover/focus lifts 2px and moves its arrow circle 3px; press settles 1px with a 0.99 scale. Mystery Box hover/focus tilts the gift icon -8 degrees and moves the arrow 4px. Hover movements are gated to fine pointers; reduced-motion disables transforms. No entry, artwork, tab or continuous animations added. Only section Liquid updated; user template settings preserved. Validation revision 16 passed. Backup before/primary-mystery-motion.liquid.

## Mystery icon — 25 September 2026
Replaced the inline gift SVG with the merchant-supplied mystery-box-peeking-eyes-edge-to-edge.ico Shopify CDN asset, displayed at 32px. Decorative image uses empty alt alongside the existing Mystery Box text. Hover/focus tilt and reduced-motion selectors now target the image. Verified image decoding at desktop and mobile widths. Liquid revision 17 passed; backup before/mystery-icon.liquid.
Icon contrast refinement: CSS brightness/invert displays dark artwork in white on the black Mystery Box background without modifying the source file. Validation revision 18 passed; hover, press, keyboard focus and reduced-motion checks passed with the new image selector.

## Sequential copy motion — 25 September 2026
Added one-time, viewport-triggered copy sequence after fonts load: heading expands 2.5% and settles (700ms); bold subheading emphasis slightly opens letter spacing and returns (750ms); any then yours receive soft lime background glows (650ms/750ms), with short gaps. Total about 3.3 seconds. A preflight spacing measurement falls back to a small visual expansion if actual spacing would wrap or overflow. Text remains present, selectable and accessible throughout. Stops when leaving the section, switching tabs, disconnecting, or enabling reduced motion; no repeat on tab return. No image, tab or entrance fade effects added. Liquid validation revision 19 passed. Backup before/text-sequence.liquid.

## Accent and sequence controls — 25 September 2026
Typography controls now exposes a shared accent colour (button fill, accent arrows and word glows), text-animation toggle, sequence speed 50–200%, total plays 1–10, continuous-repeat override and a 1–20-second pause between repeats. Defaults retain the approved green and one normal-speed play. Glow frames read the selected accent instead of hard-coded green. Speed scales the sequence's steps and short internal gaps; the repeat pause remains the explicitly chosen seconds. Repetition stops on leaving view, switching tabs, disconnection or reduced-motion preference. Only section schema/code updated; merchant settings preserved. Validation revision 20 passed. Backup prefix before/motion-controls-.

## Full-width desktop background — 25 September 2026
Removed the 1680px cap for the desktop scene stage, which caused solid side gutters on wide displays. Scene artwork now spans the viewport while copy retains a centred content inset; stage height accommodates the artwork aspect ratio. Other tab panels retain their content width and mobile rules remain unchanged. Only Liquid updated; merchant colours, typography and animation settings preserved. Validation revision 21 passed. Backup before/full-width.liquid.

Desktop gutters restored at user request. Removed only the full-scene width/height overrides and modifier class; restored centred 1680px stage. Merchant template settings preserved. Validation revision 22 passed.

Navigation strip aligned with banner: .jh__navigation now shares the centred 1680px maximum width of .jh__stage. Mobile remains full width. Liquid validation revision 23 passed. Backup before/nav-width.liquid.
