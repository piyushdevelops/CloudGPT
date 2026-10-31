# Mobile browsing fixes — 28 September 2026

Implemented on unpublished theme **187527266499**, awaiting user review. Nothing published; MAIN unchanged. User authorised the mobile audit fixes with “Go”.

## Changes against the ten audit findings

1. Search: fixed mobile overlay remains visible after deep scrolling. Body scroll locking preserves its width and position; Back restores the browsing position. Focus is trapped inside the search dialog, background content is inert, Escape closes it, and viewport resize updates its usable height.
2. Comparison: fixed dialog header and Close button; only the comparison content scrolls.
3. Header: compact mobile logo/menu/search/cart row, measured 63px versus the previous 115px initial header. Search opens on demand.
4. Legibility: 16px search input, 14px search results and cover labels, larger hero navigation and inspection labels with suitable tap targets.
5. Photo viewers: full-screen phone layout with one image pan area and persistent close/zoom/navigation controls. Mobile zoom is 2x the frame rather than a fixed 1600px image.
6. Limited Edition: one mobile reveal button directly beside its gift rail; redundant gift summary hidden on mobile. Cover switching moves the reveal to the selected scene. Removed obsolete “full list above” copy.
7. Other chapters: mobile choices precede changing imagery and copy. Natural content height replaces the fixed-height scene. Baby remains without a shopping button.
8. Planner comparison: shared specifications appear once; each planner retains its distinguishing details and shopping link. Merchant-editable shared specifications added.
9. Discovery: an early mobile Shop by category disclosure provides five merchant-editable category links. Hidden on desktop.
10. Browsing length: shorter inside-page image stage; tableware shows selection, product information and buying action before an optional arrangement disclosure. Default tableware height reduced about 280px at 393px width.

Existing merchant typography controls, accent settings and desktop hero stage rules retained. New hero quick links included in presets and the configured homepage. Desktop table arrangement remains open.

## Verification

- Browser viewport checks: 375×667, 393×852, 430×932; desktop regression at 1440×1000.
- Coordinate taps on the sticky search trigger: deep-scroll search opened at viewport top and Back restored position within 1px at all three phone sizes. Using locator clicks can first scroll the trigger into view, so these restoration checks used direct taps.
- Search query returned products; submitting opened the search results page with scrolling unlocked.
- Comparison Close remained visible after content scrolling at 375×667.
- Enlarged viewer stayed within 375×667 with controls visible and zoom contained to its pan area.
- Chapter selection showed the selected image beside its controls on mobile; Baby had no shopping link.
- Category disclosure opened and exposed the five configured collection links.
- Desktop hero, chapters and tableware visually checked; category disclosure hidden and table arrangement open on desktop.
- No document horizontal overflow observed at tested widths. Final browser error log was empty.
- Liquid/schema validation passed (validation-1 through validation-4); final homepage note correction also passed validation, artifact june-mobile-20260928 revision 5. Extracted JavaScript syntax checks passed.
- Fresh remote readback reconciles all 10 uploaded files: exact Liquid text and semantic JSON equality. See remote-checks.json. Verified remote copies synced into current-theme.

**Limit:** desktop viewport simulation, not a physical iPhone/Safari test. Actual iOS keyboard, browser chrome and safe-area behaviour still need device testing. Earlier asset/email/payment dependencies recorded in audit-implementation/README.md remain outside this change.

## Files and evidence

- changed.json lists the only uploaded paths. theme/config/settings_schema.json is a validation dependency and was not uploaded.
- before.json is the starting remote snapshot; after.json is final remote state. readback-initial.json and final-index-readback.json preserve reconciliation evidence.
- search-430x932.png, categories-375x667.png, comparison-375x667.png and viewer-375x667.png show checks.
- implement.py and refine.py are historical, non-idempotent implementation helpers; do not rerun them.

[Preview unpublished theme](https://thejuneshop.com/?preview_theme_id=187527266499)
