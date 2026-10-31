# Auto-populated photo book — research and product direction

Date: 27 October 2026

## Recommendation

Make **Auto-create my album** the primary path after a customer uploads at least 30 usable photos. Generate three complete, intentionally different drafts, let the customer choose the strongest starting point, and then open the existing studio for replacements, captions, illustrations, cropping and page-level refinement.

The generator should separate three decisions:

1. **Story order** — which photos appear together and in what sequence.
2. **Layout rhythm** — how many photos appear on each page and which image receives emphasis.
3. **Visual style** — typography, colour, backgrounds, frames and illustration intensity.

This separation matters. A customer should be able to keep a good story while trying a different look, or keep the look while changing the photo order. A generic shuffle that changes everything at once is harder to trust.

## What established products validate

- Google Photos creates a book from a selected set, saves it automatically, supports page reordering, collage pages, cropping and captions, and warns about low-resolution images. It requires at least 20 photos and begins collaging when a large set is selected.
- Shutterfly provides Autofill, alternative automatic layouts, layout shuffling, sorting/grouping by capture date, page reordering, image swapping and print warnings. Its mobile flow asks customers to choose Best/Most/All photos, image size and layout density, and embellishment quantity.
- Canva separates layouts from styles. Layout suggestions preserve and rearrange existing content, while Styles can shuffle colour and font combinations. This supports keeping content decisions independent from visual treatment.
- Photobook research consistently supports event/chapter grouping, chronology, important-image emphasis, saliency-aware crops and user refinement instead of treating generation as a final uneditable answer.

## Proposed customer flow

### 1. Upload

After 30 usable photos are available, show:

> **You have enough photos to create your first draft.**  
> We’ll arrange them into a complete album. You can change everything afterward.

Primary action: **Create my album**  
Secondary action: **Place photos myself**

Do not interrupt people who deliberately choose manual editing.

### 2. Choose generation preferences

Use one compact sheet with three short controls.

#### Story order

- **Timeline** — oldest to newest using capture dates; recommended for trips, babies, weddings and yearly albums.
- **Best moments** — strongest images lead each chapter while related images remain grouped.
- **My upload order** — preserves the customer's deliberate selection sequence.

#### Page feel

- **Spacious** — mostly one or two photos per page, more full-page heroes.
- **Balanced** — one to three photos per page with varied pacing; recommended.
- **Lively** — more multi-photo pages and occasional four-photo collages.

#### Look

- **Clean editorial** — generous whitespace, strong type, restrained frames.
- **Warm keepsake** — soft paper tones, captions and subtle memory-book details.
- **Playful scrapbook** — brighter accents, occasional illustrations and more varied composition.

Occasion can preselect the best combination, but the customer can change it.

Primary action: **Make 3 versions**

### 3. Compare three complete drafts

Show three horizontally swipeable cards:

- **A — Classic story**
- **B — Cinematic highlights**
- **C — Playful memories**

Each card should show the cover and three representative spreads, plus:

- Photos used, for example `30 of 30`
- Number of hero pages
- Number of collage pages
- The selected order, page feel and look

Actions:

- **Use this version**
- **Preview all pages**
- **Try another style**
- **Try another order**

Do not generate three almost-identical random arrangements. Each version needs a recognisable design intention.

### 4. Refine in the studio

After choosing a version, open the current page editor. The most useful next actions are:

- Replace photo
- Swap two photos
- Change this layout
- Regenerate this page
- Regenerate unlocked pages
- Add text
- Add illustration
- Crop and reposition
- Lock page
- Undo/redo

When a page is locked, future generation must preserve its photos, crop, text, illustrations and styling.

## Recommended 30-photo composition for the current book

The current 20-page product has approximately 18 editable interior pages. A premium 30-photo draft can use:

- 6 single-photo hero pages = 6 photos
- 8 two-photo pages = 16 photos
- 2 four-photo collage pages = 8 photos
- 2 quiet title, caption or closing pages

This produces contrast between large emotional moments and supporting sequences. It avoids a repetitive one-photo-per-page result and avoids making every page a dense collage.

## Aesthetic rules

### Story and pacing

- Preserve chapter/event boundaries even when exact photo chronology is relaxed.
- Prefer chronology at the chapter level; users value coherent chapters more than perfect timestamp order within every chapter.
- Open with context, build through people/details/action, and close with a calm or conclusive image.
- Do not place two visually dense collage spreads consecutively.
- Insert a quiet spread after a dense sequence.

### Image hierarchy

- Give the strongest, sharpest and most emotionally clear photographs the largest frames.
- Prefer one obvious focal image per spread.
- Use supporting images at smaller sizes.
- Keep near-duplicate burst photos out of the same book unless they form an intentional sequence.
- Avoid using the same image twice unless the customer explicitly duplicates it.

### Cropping

- Detect faces and salient subjects before selecting a crop.
- Score every crop for subject retention, resolution and distracting edge cuts.
- Use `contain` or a smaller frame when no safe crop exists.
- Never assign a low-resolution photo to a full-page frame without a visible warning.
- Do not assume rule-of-thirds is always best; research indicates centered subjects are frequently preferred when one dominant subject is present.

### Layout consistency

- Use a limited grid and consistent outer margins across the book.
- Vary composition through hierarchy and density rather than arbitrary angles everywhere.
- Keep decorative elements subordinate to photographs.
- Limit each spread to one strong decorative gesture.
- Maintain safe areas and print bleed independently from the visual template.

### Style consistency

- Define each look as tokens: type pair, palette, background family, frame family, caption treatment and illustration frequency.
- Apply style tokens across the whole book rather than styling every page independently.
- Allow **Apply style to all unlocked pages**.
- Preserve customer text and locked pages when changing style.

## Generation model

Use a stable, explainable pipeline before considering generative AI.

### Analyse each photo

- Pixel dimensions and print suitability
- Orientation and aspect ratio
- Capture date/time and upload order
- Perceptual hash for duplicate and burst detection
- Face and salient-region bounds
- Sharpness, exposure and basic aesthetic score
- Dominant colours

All feasible analysis should happen locally before upload. Face recognition is unnecessary; face detection is enough for safe crops.

### Build a storyboard

1. Cluster by capture-time gaps.
2. Preserve event/chapter boundaries.
3. Rank representative and supporting photographs inside each cluster.
4. Allocate clusters across pages without splitting a small coherent moment unnecessarily.
5. Choose a cover candidate separately from interior-page ranking.

The storyboard should be stored separately from layout and style. That permits changing the visual look without rebuilding the story.

### Generate variants

Use deterministic seeds so a version can be reproduced:

```text
version = storyOrder + density + style + seed
```

Suggested scoring weights for the first implementation:

- 30% safe crop and subject retention
- 25% story grouping and sequence
- 20% spread balance and visual rhythm
- 15% print resolution suitability
- 10% layout variety

Reject a candidate rather than merely lowering its score when it causes an unsafe face crop, duplicates an image, violates the print-safe area or places an insufficient-resolution image into a large frame.

## Controls after generation

Provide three focused shuffle actions:

- **Reorder photos** — keeps styling and approximate density.
- **Shuffle layouts** — keeps photo order and styling.
- **Change style** — keeps photo order and page layouts where possible.

Also provide **Surprise me** as an optional fourth action that changes all three. It should create a new version instead of overwriting the selected version.

## Version safety

- Never overwrite the customer's current draft when generating an alternative.
- Save generated versions as lightweight configuration snapshots.
- Keep at least the current version and two alternatives.
- Mark manually edited pages as changed.
- Ask before regenerating a manually edited but unlocked page.
- Preserve locked pages without prompting.
- Make generation and version switching undoable.

## Photo-count policy

- Fewer than 30 usable images: offer manual creation and explain that 30 enables a fuller automatic draft.
- 30–40: use nearly all photos and favour spacious/balanced layouts.
- 41–60: let the customer choose Best photos or Use all.
- More than 60: automatically select representative images while keeping every unused photo in the tray.

`Usable` means the image can be decoded, has enough resolution for at least one supported frame, and is not an exact duplicate.

## First implementation scope

### Phase 1 — dependable auto-layout

- 30-photo gate
- Orientation, resolution, date and duplicate analysis
- Timeline and upload-order story modes
- Three page-density modes
- Three design looks using the existing layout/background/frame libraries
- Three generated versions
- Whole-book selection
- Regenerate page
- Page locking
- Existing manual editor integration

### Phase 2 — stronger storytelling

- Face/saliency crop protection
- Best-moments ranking
- Time-based chapters
- Same-spread photo swapping
- Mix a page from another version
- Unused-photo recommendations

### Phase 3 — optional intelligence

- Scene/theme grouping
- Suggested chapter titles and captions, always customer-approved
- Personal preference learning from selected versions
- More occasion-specific art direction

## Success measures

- Percentage of eligible customers who choose auto-create
- Percentage who select one of the first three versions
- Time from upload completion to approved draft
- Number of manually replaced photos
- Number of regenerated pages
- Number of low-resolution warnings at checkout
- Completion and add-to-cart rate versus manual creation
- Customer-reported satisfaction with the generated first draft

The most useful signal is not whether customers make zero edits. A good generator gives them a credible, emotionally coherent first draft that requires only enjoyable changes.

## Implemented — 27 October 2026

Phase 1 is live in Railway deployment `640f3a94-5fbc-4f0f-82ca-03db0b9cf2fb`.

- Auto-create unlocks at 30 uploaded photos.
- Customers choose Timeline, Highlights first, or Upload order.
- Customers choose Spacious, Balanced, or Lively page density.
- Customers choose Clean editorial, Warm keepsake, or Playful scrapbook styling.
- The studio generates three complete previews and can remix order, layouts, or styling.
- Applying a version preserves the existing square canvas and all normal manual editing tools.
- Pages can be locked before switching versions. Locked content remains unchanged, while unlocked pages rebalance so every uploaded photo appears once and no page is left empty.
- Try another changes the current page treatment while retaining the photos already assigned to that page.
- Generated alternatives, the chosen version, page locks, and the resulting book persist in the local draft.

Validation covered repeated randomized 30-photo runs on 390 × 844 mobile and 1440 × 1000 desktop, version switching, locked-page merging, page regeneration, save/restore, square canvas geometry, the full editor button suite, final preview, PDF export and cart handoff. Exact production readback passed for all five changed runtime files.

## Research sources

- Google Photos Help — Create a photo book: https://support.google.com/photos/answer/7378811
- Google Photos Help — Edit a photo book: https://support.google.com/photos/answer/7378727
- Shutterfly Help — Personalizing a Photo Book: https://support.shutterfly.com/s/article/personalizing-a-photo-book
- Shutterfly Help — Photo Book iOS App: https://support.shutterfly.com/s/article/beta-photo-book-editor-on-the-app
- Canva Help — Use Layouts: https://www.canva.com/help/using-layouts/
- Canva Help — Colour palettes and font combinations: https://www.canva.com/en_in/help/color-and-font-combinations/
- Event-enabled intelligent asset selection and grouping for photobook creation: https://www.sciencedirect.com/science/article/abs/pii/S0262885615001419
- Hierarchical Narrative Collage For Digital Photo Album: https://onlinelibrary.wiley.com/doi/10.1111/j.1467-8659.2012.03210.x
- How Do People Organize Their Photos in Each Event?: https://dl.comp.nus.edu.sg/items/cbabbf4e-d88f-457f-8d05-6b01152cf2c5
- Balance-Aware Grid Collage for Small Image Collections: https://pubmed.ncbi.nlm.nih.gov/34529567/
- Salient-Centeredness and Saliency Size in Computational Aesthetics: https://doi.org/10.1145/3588317

