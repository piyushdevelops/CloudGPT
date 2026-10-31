# Two cart presentations — 8 October 2026

Installed on unpublished theme 187527266499; nothing published. Four exact remote readbacks recorded in final-readback.json. Originals saved in before/. Refresh remote files before further changes because three chats share the theme.

## Behaviour

Successful native product-form cart updates now open a compact non-modal preview anchored below the visible cart icon. It displays all cart lines in a capped scrolling area, quantity labels, subtotal, original GoKwik checkout button and View full cart. No dimming or page scroll lock. Five seconds idle closes it; mouse hover and keyboard focus pause dismissal, interaction resets the timer, outside pointer/click and Escape dismiss. Cart icon and View full cart open the existing full drawer (desktop) / full-width cart (mobile).

Reuses the existing native drawer content and GoKwik handler without copying cart state, issuing cart mutations or dispatching additional analytics. Only successful product-form-component updates with returned drawer sections are rerouted to the preview. Explicit redirect-to-checkout/cart actions remain untouched. Scoop confirmation is suppressed while this preview feature is enabled, avoiding duplicate confirmation surfaces.

Cart drawer editor > Add-to-cart preview offers enable, inactivity seconds (3–15, default 5), desktop width (320–440, default 380), heading and full-cart label. Existing cart typography and master palette continue to supply font families/weights/colours; compact presentation uses smaller role sizes.

## Verified

- Actual product-page Add to Cart opens compact preview after response, with latest quantity and subtotal.
- Idle preview closes; focus inside keeps it open beyond timeout.
- Desktop 1440 and mobile 393 previews visually checked; desktop.png and mobile.png saved.
- View full cart opens native modal with quantity controls and full layout.
- Header cart icon opens full cart after preview dismisses.
- Compact Checkout opens GoKwik mobile-number stage with matching 5 items and ₹7,995 subtotal. No personal information entered and no order placed.
- All temporary test units removed with native Remove; header returned to zero.
- New Liquid snippet passes Theme Check; JavaScript passes syntax check. Bundled skill validator unavailable due missing dependency; repository validator used.

## Limits

No conversion-lift claim. Physical Safari, many distinct lines, quick-add/bundle integrations, screen reader and full keyboard regression, analytics delivery/deduplication and completed payment still require testing. Standard native event source is supported; custom app cart mutations with other event contracts require a separate check. Dedicated /cart page remains unchanged.
