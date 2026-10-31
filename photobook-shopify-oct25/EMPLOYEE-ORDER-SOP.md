# June Photo Book Order SOP

**Audience:** Customer experience, order operations, design preflight and print-production teams  
**Version:** 25 October 2026  
**Applies to:** June Photo Book orders created through June Photo Studio

## Important current limitation

Do not release a photo-book order to print unless the complete designed album file has been received and checked.

The current test build saves customer photos and page edits in the customer's browser using IndexedDB. Shopify receives the product variant, album title, size, page count and a June draft ID. It does **not** currently receive the customer's photos, chosen cover, occasion, page layouts, text, backgrounds, illustrations or designed PDF.

The customer can download a PDF at the end, but that PDF is downloaded to their device and is not automatically attached to the Shopify order. Until cloud design upload is implemented, staff cannot find the photos or final design inside Shopify.

## What appears in Shopify

Open **Shopify Admin → Orders → select the order → Products → June Photo Book**.

The line item should show:

| Shopify field | Meaning |
| --- | --- |
| Variant | The customer's selected size and page count |
| Album title | The title entered by the customer |
| Album size | `Regular` or `Large` |
| Page count | Total pages selected |
| `_June draft` | Device-local draft identifier for support reference |
| Quantity | Normally `1` |

The current cart does not include occasion, cover name, subtitle or individual design choices.

## Order statuses

Use these internal tags or equivalent statuses:

- `PB-AWAITING-DESIGN` — paid order received, but the designed file is unavailable.
- `PB-DESIGN-RECEIVED` — customer design file received and saved against the order.
- `PB-PREFLIGHT-ISSUE` — the file needs customer correction or approval.
- `PB-READY-TO-PRINT` — design and commercial details have passed checks.
- `PB-IN-PRODUCTION` — released to the print partner.
- `PB-QC-PASSED` — printed album passed physical inspection.
- `PB-DISPATCHED` — shipment created and customer notified.

Never mark an order `PB-READY-TO-PRINT` using only the draft ID.

## Process an incoming order

### 1. Confirm payment and product details

1. Open the order in Shopify Admin.
2. Confirm payment is captured and the order is not cancelled, refunded or flagged for review.
3. Confirm the June Photo Book line item contains size, page count and album title.
4. Compare the charged line price with the selected variant price.
5. Add the `PB-AWAITING-DESIGN` tag if no production file is attached or linked.
6. Do not fulfil the order at this stage.

### 2. Locate the customer's design file

In the current test build, no design file is uploaded to Shopify. Check the order timeline and internal support system for a manually supplied PDF. If nothing is attached:

1. Contact the customer using the approved photo-book design request template.
2. Ask them to reopen the studio on the same device and browser they used to design the album.
3. Ask them to select **Preview album → Download album PDF**.
4. Provide the approved secure upload link or customer-support attachment channel.
5. Tell the customer not to send loose photos unless the design team has agreed to rebuild the album.
6. Record the received filename and upload location in a private order note.
7. Add `PB-DESIGN-RECEIVED` and remove `PB-AWAITING-DESIGN`.

Do not ask customers to send photos through public comments, social media or an unsecured shared link.

### 3. Check what the customer selected

Use the Shopify line item for:

- Album title
- Size
- Page count
- Price and quantity
- June draft ID

Use the received designed PDF for:

- Selected cover artwork and cover text
- Photo placement and crop
- Page layout and sequence
- Backgrounds, frames and illustrations
- Captions, dates and other text
- Blank pages and intended white space

The designed PDF is the production reference. If the Shopify size or page count does not match the PDF, stop the order and clarify with the customer.

### 4. Preflight the design

The preflight operator should check:

- PDF opens without errors and every page renders.
- Album title matches the Shopify line item.
- PDF page count matches the purchased variant.
- Trim size matches `Regular · 8 × 8 in` or `Large · 11 × 11 in`.
- Cover and interior pages are present in the expected order.
- Important faces and text remain inside the safe area.
- No unintended object crosses the locked bleed/safe boundary.
- Photos are not visibly pixelated at print size.
- Text is readable and contains no obvious clipping or missing fonts.
- No editor controls, dashed selection outlines or placeholder labels appear.
- No unexpected blank page exists.
- Backgrounds reach the required print boundary where intended.
- Customer-supplied text is reproduced as entered; staff must not silently rewrite it.

If a problem could change the finished album, tag `PB-PREFLIGHT-ISSUE`, describe it in a private note and obtain customer approval before editing or printing.

### 5. Prepare the print job

1. Rename the approved file using `OrderNumber_DraftID_Size_Pages_vFinal.pdf`.
2. Save it in the restricted production order folder for that order.
3. Add the secure internal file link to the Shopify order's private note.
4. Record the preflight operator, date and approval version.
5. Add `PB-READY-TO-PRINT`.
6. Send only the approved final file to the print partner.
7. Add `PB-IN-PRODUCTION` and record the production job number.

### 6. Physical quality check

Before dispatch, confirm:

- Correct order number, size and page count
- Correct cover and album title
- Pages are complete and in sequence
- No upside-down, duplicated or missing spreads
- Crops match the approved PDF
- Colour and exposure are commercially acceptable
- Binding, trimming and lay-flat opening are sound
- Cover, corners and pages are clean and undamaged

Record the checker and date, then add `PB-QC-PASSED`.

### 7. Fulfil and dispatch

1. Pack the album using the approved protective packaging.
2. Create the shipment against the correct Shopify order.
3. Enter tracking information and mark the item fulfilled only after carrier handover.
4. Add `PB-DISPATCHED`.
5. Retain the production file according to the approved privacy and retention policy, then securely delete it when that period ends.

## Customer support rules

- A June draft ID identifies a browser draft; it does not give staff access to that draft.
- Ask the customer to use the same device and browser because drafts are currently device-local.
- Clearing browser data, private browsing or changing devices can make the draft unavailable.
- Never promise that staff can recover photos from Shopify in the current release.
- Never request more customer photos than needed for the order.
- Do not download customer files to personal devices.
- Keep design links in private order notes, never customer-visible notes or public channels.

## Required production improvement before normal fulfilment

Before accepting photo-book orders at scale, **Confirm design & add to cart** should upload an immutable production package to the private Google Drive folder **June Photo Book Orders**, organised by customer reference, Shopify order number and design ID. It should attach a protected design reference to the Shopify line item or order. GitHub must not be used for customer photos or production files. The package should include:

- Low-resolution proof PDF
- High-resolution print-ready PDF
- Cover preview
- Occasion, cover ID/name, title and subtitle
- Size, page count, price and variant ID
- Page layout/background/frame/text/illustration data
- Draft ID and immutable design version
- Upload status, checksum and creation time

Staff need a private order-admin link that opens the exact purchased design without relying on the customer's browser. Access should be restricted, logged and covered by a defined retention/deletion policy.

Until this handoff exists, the photo-book flow is suitable for controlled testing only. Every test order needs the manual PDF collection process above.

The approved storage and rendering design is documented in [DESIGN-HANDOFF-ARCHITECTURE.md](DESIGN-HANDOFF-ARCHITECTURE.md).

