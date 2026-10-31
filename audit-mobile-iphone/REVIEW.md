# iPhone-proportion browsing review — 28 September 2026

Read-only review of the current unpublished theme 187527266499, after the audit implementation. No theme files changed.

Viewport checks: **393 × 852**, **375 × 667**, **430 × 932**, portrait. These are browser viewport tests at iPhone proportions, not physical iPhone/Safari tests. Native keyboard, Safari toolbar expansion, notch/safe areas, rubber-band scrolling and real touch gestures were not emulated. The desktop browser also reserves a scrollbar gutter. Shopify's preview toolbar was hidden before assessing normal browsing.

The previous absence-of-horizontal-overflow checks missed significant interaction problems. The page can fit the viewport and still be difficult to browse.

## Findings, in recommended fix order

1. **P1 — Search can strand the shopper after scrolling.** At 430 × 932, tapping the floating search box with the page scrolled to 6797px opened mobile-search mode and locked page overflow. The header then sat at −6321px, with the input/back controls off-screen. The page also jumped to 6328px. Escape recovered the browser test, but that is not a usable normal phone dismissal route. Also reproduced at 393 × 852. The local source combines a sticky header with `overflow:hidden` on both html and body when search opens. Replace this with a properly viewport-fixed search surface and preserve/restore scroll position. See `search-disappeared-430x932.png`.

2. **P1 — Comparison close control scrolls away.** The comparison dialog contains about 1218px of content. After scrolling, its close button was at −411px at 393 × 852 and −582px at 375 × 667. Keep a persistent dialog header/close control and constrain scrolling to the content. Do not rely on a phone user having Escape. See `comparison-close-offscreen-375x667.png`.

3. **P2 — The header takes too much visual priority during browsing.** It measures 115px at the top and remains a floating 58px strip, 7px from the top, while scrolling. It covers passing imagery/text and constantly prioritises search over the selected product. Use one compact persistent navigation row; expand search deliberately when requested. This is separate from the disappearing-search defect.

4. **P2 — Several labels are too small for comfortable reading.** Search input computes to 9.5px; hero category labels and Limited Edition cover names are 10px; the Undated “Inspect photo” caption is 9.35px. Long cover names wrap into three tiny lines. Increase label readability and give long names room, without shrinking tap targets or scaling glyphs horizontally.

5. **P2 — The image viewer has competing scroll areas and excessive initial zoom.** At 393 × 852, zoom uses a 1600px-wide image inside a 297px-wide viewing area, and the dialog itself also overflows vertically. The enlarged view starts on upper-left props rather than the useful planner fields. Navigation sits at the screen's bottom edge. Use a phone-oriented full-screen viewer, persistent close/navigation, and a sensible zoom centred on the spread. See `zoom-viewer-393x852.png`.

6. **P2 — “See what’s inside” does not reveal the result near the action.** After tapping, the label changes to “Pack it back up,” but the extras start over 1100px below the viewport top in the tested state. Cover selection, product details, purchase links and planner artwork separate the action from its result. Put the disclosure beside its content, or provide an intentional movement to the revealed content that clears the header. The separate “See every included extra” disclosure adds another competing way of understanding the same offer.

7. **P2 — Chapter selection can update imagery the shopper cannot see.** On the short 375 × 667 viewport, the navigation initially falls below the first section view. After selecting Baby through those controls, the new image occupied −273px to −13px, entirely above the viewport; the controls remained visible around 299px. Bring chapter controls before/with the changing content, or keep selection and feedback together without a surprise jump.

8. **P2 — Mobile comparison is still a reading exercise.** The three products are stacked as long individual cards, each repeating size/paper/binding facts. The shopper must remember one card while scrolling to another. Separate shared specifications from the few differences, then compare those differences compactly. This is a usability finding beyond the close-button defect.

9. **P2 — Category discovery and the overall browsing journey remain long.** At 393 × 852 the page measured roughly 10,173px in the sampled state—about twelve full viewport heights before allowing for the sticky strip. Hero category navigation follows the whole hero. Several later categories require many screens of scrolling. Add clear early category access and reduce repeated planner explanations/secondary actions, while preserving the planner-led hierarchy. The hamburger menu works, but planner navigation also involves nested category disclosure.

10. **P2 — Several sections still put too much interaction before the shopping decision.** At 375 × 667: Undated is 877px, Inside Discovery 900px, Glassware 960px, Tableware 1019px, and Limited Edition open is 1383px. Tableware presents the illustrated pieces, arrangement controls and a second piece selector before purchase details. Inside Discovery has inspection plus two shopping routes. Retain useful controls, but prioritise a clear selected product, price and primary action; move optional exploration into compact disclosure. These are layout/friction findings, not claims that the actions are broken.

## What worked

- No document-wide horizontal overflow in the sampled phone widths.
- Mobile menu opened, closed and expanded planner categories.
- Chapter content changed, and the unavailable Baby state remained intact.
- Dialog Escape close worked in the desktop test; this does not resolve the phone close-button issue.
- Current catalog links, quantity text and visible prices remain present.

## Recommended next revision

First fix mobile search positioning/scroll locking and persistent dialog dismissal. Then simplify the mobile header, improve small labels, redesign viewer scrolling, and keep selection controls near their changing content. Finally shorten category discovery and repeated section controls. Test those changes with the actual iPhone keyboard and Safari browser chrome before mobile sign-off.
