/* Recover only GoKwik's initial frame handshake in the unpublished preview. */
(() => {
  const theme = window.Shopify && window.Shopify.theme;
  if (!theme || Number(theme.id) !== 187527266499 || theme.role !== 'unpublished') return;
  if (!/\.(myshopify\.com|shopifypreview\.com)$/.test(location.hostname)) return;
  const origin = document.currentScript.dataset.checkoutOrigin;
  if (!['https://pdp.gokwik.co', 'https://sandbox.pdp.gokwik.co'].includes(origin)) return;
  let frame, timer, ready = false, retried = false, notice;

  function clearNotice() {
    if (notice) notice.remove();
    notice = null;
  }

  function retry() {
    if (!frame || !frame.isConnected || ready) return;
    clearNotice();
    const url = new URL(frame.src);
    if (url.origin !== origin || url.pathname !== '/index.html') return;
    // The SDK continues sending its original cart until this frame acknowledges it.
    url.searchParams.set('june_preview_retry', String(Date.now()));
    frame.src = url.href;
    arm();
  }

  function showNotice() {
    notice = document.createElement('div');
    notice.setAttribute('role', 'alert');
    notice.setAttribute('data-june-checkout-recovery', '');
    Object.assign(notice.style, {
      position: 'fixed', zIndex: '2147483647', left: '50%', top: '50%',
      transform: 'translate(-50%, -50%)', width: 'min(360px, calc(100vw - 32px))',
      padding: '24px', borderRadius: '16px', background: 'var(--june-bg, #fff)',
      color: 'var(--june-ink, #171717)', boxShadow: '0 8px 40px #0003',
      boxSizing: 'border-box', fontFamily: 'inherit', fontSize: '16px', lineHeight: '1.5'
    });
    const message = document.createElement('p');
    message.textContent = 'Checkout is taking longer than expected. Your items are still in your bag.';
    message.style.margin = '0 0 16px';
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Try checkout again';
    Object.assign(button.style, {font: 'inherit', padding: '10px 16px', borderRadius: '24px', cursor: 'pointer'});
    button.addEventListener('click', retry);
    const back = document.createElement('a');
    back.href = ((window.Shopify.routes && window.Shopify.routes.root) || '/') + 'cart';
    back.textContent = 'Back to cart';
    Object.assign(back.style, {display: 'block', marginTop: '12px', color: 'inherit', textDecoration: 'underline'});
    notice.append(message, button, back);
    document.body.append(notice);
    button.focus();
  }

  function arm() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (!frame || !frame.isConnected || ready) return;
      if (!retried) {
        retried = true;
        retry();
      } else showNotice();
    }, 12000);
  }

  window.addEventListener('message', event => {
    if (!frame || event.origin !== origin || event.source !== frame.contentWindow) return;
    if (event.data !== 'clearGokwikIframeInterval') return;
    ready = true;
    clearTimeout(timer);
    clearNotice();
  });

  function inspect() {
    const next = document.getElementById('gokwik-iframe');
    if (next === frame) return;
    clearTimeout(timer);
    clearNotice();
    frame = next;
    ready = false;
    retried = false;
    if (frame) arm();
  }

  function start() {
    new MutationObserver(inspect).observe(document.body, {childList: true, subtree: true});
    inspect();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
  else start();
})();
