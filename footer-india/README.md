# Footer payment and delivery refinement — 5 October 2026

Installed only on unpublished theme 187527266499. MAIN and payment-provider configuration unchanged.

- Replaced lone PayPal icon with merchant-controlled Indian payment row; excluded PayPal.
- Displayed methods UPI, Paytm, Visa, Mastercard and net banking reproduce the current public footer's listed methods. Evidence: https://thejuneshop.com/pages/faqs (footer). This is not transaction-level gateway verification.
- Extra switches: Google Pay, PhonePe, RuPay, cash on delivery, EMI/pay later and wallets. Off pending merchant confirmation. Optional logo-strip image and accessible description supported.
- Controls: Footer > June · The footer > Indian payment methods. Display settings do not activate checkout methods.
- Delivery selector: label above field, visible border/native arrow, aligned accent Apply, 46px controls and 16px select. Native country/language form retained.
- Payment panel separated from legal links. Responsive wrapping; master palette and typography retained.

## Verification
1. Both changed files passed project validator after fetching missing legacy dependencies. Skill bundled validator lacked dependencies. Existing settings preserved except new payment block/order entry.
2. Fresh preview showed intended methods, no PayPal. No overflow at1440x1000,393x852,430x932,374x666. Selected Canada then restored India without submission; Tab focused Apply with visible outline. Native /localization action retained. Desktop screenshot tool produced tiled output, visually inspected; saved screenshot attempt failed. Physical iPhone and full editor visual check incomplete.
3. Liquid exact readback match. Shopify added standard generated-file comment to group JSON; parsed data exactly matches upload. Remote files synced to current-theme. final-readback.json records both and UNPUBLISHED role.

Changed: sections/june-footer.liquid and sections/footer-group.json. Footer also renders outside homepage. No palette values, checkout configuration or other sections changed.
