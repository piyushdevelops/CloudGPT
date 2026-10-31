# Apricot & Lilac — 29 September 2026

User chose option 02 and authorised application. Installed on **unpublished theme 187527266499**, awaiting visual review. Nothing published; MAIN unchanged.

| Role | Colour | Applied use |
|---|---|---|
| Main surface | #FAF7EF Ivory | Most homepage sections and shared light theme schemes |
| Actions | #F5A477 Apricot | Primary buttons, selected states, header badge fills |
| Text | #191816 Ink | Headings, body text, button labels |
| Feature surface | #E7E1F0 Lilac | Inside pages, Mystery Box, baby chapter |
| Supporting surface | #EEE8DD Oat | Footer, wedding chapter, image surrounds |
| Dark surface | #241C18 Espresso | Lighting and shared dark scheme |

All 12 June sections retain their merchant colour and typography controls. Defaults were updated as well as configured instances. Hero gutters, sizing, imagery, animations and interaction logic preserved. Shared scheme IDs/assignments retained; semantic error, sale and status badge colours preserved. Header accent text and labels on apricot use dark ink for contrast. Product photography and existing independently styled product-page blocks were not recoloured; shared product buttons inherit the new scheme.

## Validation and review

- Shopify Liquid/schema validation: all 18 changed files passed, revision 2, see validation.txt. Initial run lacked the locale dependency; supplied the existing locale for validation only. No locale or settings-schema file uploaded.
- Fresh before snapshot reconciled immediately before saving: no intervening remote changes; theme UNPUBLISHED.
- Final remote readback: 18/18 match (exact Liquid and semantic JSON); verified copies synced to current-theme. See remote-checks.json.
- Desktop 1440×1000 and mobile 393×852 visually checked. Computed backgrounds/text verified for all 12 sections; no mobile document overflow.
- Standard product-page Add To Cart renders apricot with ink text. Existing independent product-page design uses its own styling; a quantity-label translation issue was observed there and is outside this palette-only change.
- Screenshots: desktop-inside.png and mobile-inside-393x852.png.
- Physical iPhone/Safari not tested. This was a colour-only regression check, not a new full interaction audit.

Source and rollback: before.json, after.json and changed.json. apply.py is a historical one-time helper; do not rerun against newer remote state. Only changed.json paths were uploaded.

[Preview](https://thejuneshop.com/?preview_theme_id=187527266499)
