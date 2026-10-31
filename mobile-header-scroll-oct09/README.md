# Mobile scroll island restored

Restored missing scoop_scroll block in sections/header-group.json on unpublished 187527266499. Mobile enabled, desktop left disabled to preserve existing behaviour. No header surface changes.
Existing JS and snippet reused unchanged. Defaults: 70px threshold, 148x38px pill, 10px floating gap, 640ms transition.
Fresh read and immediate prewrite compare passed; exact readback passed.
393x852 Chrome: scrollY82 gives 148px width and 10px top; return to scrollY0 restores original209px scoop and top0. Physical Safari remains untested.
Inline screenshot saved as island-preview.png. Nothing published.
