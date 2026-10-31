# Photo Book R2 Storage, Drive Archive and Print Handoff

## Decision

Customer photos and album files must not be stored in GitHub. Use a private Cloudflare R2 Standard bucket for active customer uploads, recoverable drafts and rendering. Archive each confirmed production package in the private Google Drive folder [June Photo Book Orders](https://drive.google.com/drive/folders/1Q0kkeX_nWZg8bMIfJxxxBpDS7eynLURZ) (`1Q0kkeX_nWZg8bMIfJxxxBpDS7eynLURZ`).

R2 is the active application store so large mobile uploads, expiring links and autosaves remain reliable. Google Drive is the production archive and staff handoff. The confirmed package must be copied to Drive before the Shopify cart handoff succeeds.

The browser's IndexedDB remains a fast local autosave, but it is only a cache. The cloud draft is the recoverable source of truth.

## Files to retain

Each album has a server-generated `customerRef`, `designId` and immutable `designVersion`. After checkout, the Shopify order number is linked to the same job. A customer name or email address must never be the only identifier.

```text
June Photo Book Orders/
  {customerRef}/
    {shopifyOrderNumber-or-PENDING}_{designId}/
      01 Customer uploads/{assetId}.{extension}
      02 Design/design-v{version}.json
      02 Design/manifest-v{version}.json
      03 Customer proof/proof-v{version}.pdf
      03 Customer proof/cover-preview-v{version}.webp
      04 Print ready/print-v{version}.pdf
```

`design.json` stores the selected occasion, cover, title, subtitle, size, page count and every page object's position, crop, zoom, rotation, layer, frame, background, illustration and text value. It references server asset IDs rather than temporary browser blob URLs.

`manifest.json` stores file checksums, pixel dimensions, PDF page count, trim size, bleed, design version, generation time and customer confirmation time.

## Customer workflow

1. On the first meaningful edit, the server creates a private design record and returns a random `designId` plus a short-lived customer edit token.
2. Each uploaded photo is sent to the production server with a resumable upload. The server stores it privately and records its Google Drive file ID against the design. Uploads must resume after a dropped mobile connection and must not depend on a public Drive link.
3. The server validates file type, byte size and image dimensions, strips unsafe metadata where appropriate, creates a small thumbnail and records the original asset.
4. Design changes autosave `design.json` to a new recoverable draft version. IndexedDB continues to protect work during a temporary network loss.
5. The final review shows the exact price, size, page count and preflight warnings.
6. When the customer selects **Confirm design & add to cart**, the server freezes an immutable design version.
7. A server-side render job creates both PDFs from the same frozen design version:
   - `proof-low.pdf` for customer review and staff browsing.
   - `print-high.pdf` for production.
8. The server uploads the originals, design JSON, manifest and both PDFs to the matching Drive job folder. It validates Drive readback, records file IDs and checksums, and marks the version `READY` only after every file exists.
9. Shopify receives the variant and non-sensitive line-item references: design ID, version, title, size, page count and render status.
10. Cart handoff happens only after the final render job succeeds. Retrying confirmation is idempotent and cannot create duplicate production versions.

## PDF outputs

### Low-resolution proof

- Screen-optimised RGB PDF
- Approximately 120–150 PPI at final trim size
- Compressed JPEG content suitable for mobile review
- Optional `PROOF` watermark until customer confirmation
- Fast staff preview and customer download
- Never sent to the printer as production artwork

### High-resolution print file

- 300 PPI at the printer's confirmed trim size
- Correct bleed, safe area, cover wrap, spine and binding allowances
- Embedded fonts or outlined text according to printer specification
- Printer-approved colour space and output profile
- High-quality image compression with no proof watermark
- Immutable after customer confirmation
- Checksum recorded in `manifest.json`

Final pixel dimensions and PDF boxes must come from the printer's written specification. Do not assume that an 8 × 8 or 11 × 11 document uses only the nominal trim dimensions; bleed and cover construction add area.

## Shopify order data

Attach these line-item properties:

- `_June design ID`
- `_June design version`
- `_June render status`
- `Album title`
- `Album size`
- `Page count`
- `Cover name`
- `Occasion`

Do not attach public Google Drive URLs. Staff retrieve files through a private order-admin page or their authorised Drive account using the protected design reference.

The Shopify order webhook should link the Shopify order ID to the confirmed design version. The design must remain available even if cart cookies or local browser storage are later cleared.

## Staff and printer access

- Customer experience can view the low-resolution proof and design summary.
- Preflight and production staff can access both PDFs.
- The print partner receives a time-limited link to the high-resolution PDF only after the order is approved.
- Every download is logged with user, order, design version and time.
- Re-rendering creates a new version; it never silently replaces the file attached to an existing approval.

## Security and retention

- Private Drive root folder with public access disabled
- Encryption in transit and at rest
- Least-privilege service credentials stored as Railway secrets
- Resumable server uploads and expiring customer downloads
- File-type validation, size limits and malware scanning
- Access logs and render audit trail
- Automated deletion based on an approved retention period
- Immediate purge workflow for cancelled orders and valid privacy requests
- Drive backup and deletion rules aligned with the retention policy

## Launch gate

The album product should remain in controlled testing until all of these pass:

- Original photo upload and cross-device draft recovery
- Interrupted-upload retry and duplicate protection
- Low- and high-resolution server rendering
- Pixel, bleed, font and page-count preflight
- Customer confirmation recorded against an immutable version
- Shopify order-to-design lookup
- Staff permission checks and signed downloads
- Print-partner handoff and access expiry
- Retention and deletion tests

