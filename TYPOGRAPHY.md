# Shared typography and actions

Reference: user's social-media portfolio typography, approved for implementation 25 September 2026. Poppins is a visual approximation, not a verified identification of the reference font.

## Type roles

| Role | Family / weight | Desktop | Mobile | Tracking | Line height |
| --- | --- | --- | --- | --- | --- |
| Hero display | Poppins 900 | 96px maximum, fluid | 64px maximum, fluid | -0.04em | 1 |
| Section heading | Poppins 900 | about 62px | about 45px | -0.04em | 1 |
| Subheading | Poppins 400, emphasis 700 | 26px | 22px | -0.02em | 1.35 |
| Supporting text | Poppins 400 | 18px | 16px | -0.01em | 1.5 |
| Eyebrow | Poppins 500 | 11px | 10px | 0.12em | 1.5 |
| Action label | Poppins 600 | 14px | 14px | -0.01em | 1.3 |
| Navigation | Poppins 500 | 13px | 10px | -0.01em | 1.3 |

Use natural font proportions: do not horizontally scale glyphs. Prefer sentence case. Use short, deliberate line wraps and selective bold emphasis. Scale sizes to section hierarchy; later sections should not repeat the hero's oversized heading.

## Actions

Primary action: editable vivid orange fill (#F56A28), dark text, capsule outline, slight dark left edge; a 32px black circle contains an 18px SVG right arrow. Minimum 50px hit area. Secondary actions remain underlined text links with a smaller circular arrow and at least a 44px hit area. Keep visible keyboard focus and respect reduced motion. Buttons and links retain semantic behaviour; arrows are decorative.

## Merchant controls

Every custom section must expose font family, weight, desktop/mobile size, letter spacing and line spacing by role. Button fill is editable. Section 1's main font and sizes are section settings; detailed text controls are in its Typography controls block. Subheading emphasis is a plain-text setting, escaped before safely wrapping matching text in a strong element. All rules are section-scoped. Future builds use these defaults and the same controls, adapted to their content.

## Approval status

LOCKED by the user on 25 September 2026 for the website going forward, until changed. Use this system consistently when building or revising subsequent sections; vary type size by hierarchy and responsive layout, not the font/style direction. Font and spacing controls remain editable. Approval applies to the style system, not theme publication.

Accent colour is merchant-selectable; vivid orange #F56A28 is the current default following user-approved option 20 Bold Minimal (30 September 2026). Section 1 uses the same colour for primary action fill, accent arrows and word glows. Its text sequence has editable enable/disable, speed, play count, continuous-repeat and pause controls in the Typography controls block.

## Approved homepage small-type system — 5 October 2026
User-approved rollout is documented in home-type-rollout/README.md. Use shared June typography controls and assets/june-home-typography.css for homepage small-text roles. Archivo Black prices34/30px with smaller ₹ for INR; Poppins700 actions15/14px; support500 at15/14px; labels700 at12/11px; utility500 at13px. Preserve all heading/subheading approvals and controls. Use snippets/june-price.liquid for new prices and june-photo-viewer with Zoom in. Order shopping action before comparison/collection action before quiet policies. Section opt-outs preserve saved legacy controls. These roles supersede earlier small-type defaults for new homepage work; no global heading redesign was approved.
