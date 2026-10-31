const fs = require('fs');
const file = 'styles.css';
let css = fs.readFileSync(file, 'utf8');
css = css.replace(
  '.preview-stage{position:relative;background:var(--yellow);border:2px solid var(--ink);border-radius:36px;padding:12%;min-height:570px}',
  '.preview-stage{position:relative;background:var(--yellow);border:2px solid var(--ink);border-radius:36px;padding:7%;min-height:570px;overflow:hidden}.preview-product-image{width:100%;height:100%;min-height:470px;object-fit:cover;border:2px solid var(--ink);border-radius:22px;display:block;transform:rotate(-2deg);box-shadow:14px 16px 0 rgba(23,23,23,.24)}.memory-caption{position:absolute;left:8%;bottom:7%;display:flex;flex-direction:column;gap:3px;background:var(--white);border:2px solid var(--ink);border-radius:16px;padding:13px 18px;transform:rotate(1deg);box-shadow:5px 6px 0 var(--ink)}.memory-caption span{font:800 9px Poppins;letter-spacing:.15em}.memory-caption strong{font:800 18px Poppins}.memory-caption small{font-size:11px}'
);
css = css.replace(
  '.preview-stage{min-height:410px;padding:12% 7%;margin-bottom:50px}',
  '.preview-stage{min-height:410px;padding:6%;margin-bottom:50px}.preview-product-image{min-height:360px}.memory-caption{left:5%;bottom:5%;right:5%}'
);
css = css.replace('.sample-spreads{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.sample-spreads div{min-height:180px;border:1.5px solid var(--ink);background:var(--white);padding:20px}.sample-spreads div:nth-child(2){background:var(--yellow)}', '');
css = css.replace('.sample-spreads{display:block}.sample-spreads div{margin:10px 0}', '');
css = css.replace('background:linear-gradient(135deg,rgba(246,200,74,.2),rgba(243,91,63,.18)),url("assets/bubble-memory-v1.png") center 48%/cover', 'background:#eee6cf');
fs.writeFileSync(file, css);
