const fs=require('fs'),path=require('path');
const root=__dirname, before=path.join(root,'before'), out=path.join(root,'theme');
const read=p=>fs.readFileSync(path.join(before,p),'utf8');
function write(p,s){fs.mkdirSync(path.dirname(path.join(out,p)),{recursive:true});fs.writeFileSync(path.join(out,p),s)}
const schema=JSON.parse(read('config/settings_schema.json'));
const controls=[{type:'checkbox',id:'june_product_brand',label:'Use approved product brand styling',default:true},{type:'paragraph',content:'Prices, buttons, supporting copy, labels and captions use June typography and June typography utilities. Colours use June master palette. Disable to restore saved template styles.'}];
for(const [role,label,size,mobile] of [['heading','Product titles',40,30],['section','Section headings',44,32],['subheading','Subheadings',22,18]]){
 controls.push({type:'header',content:label},{type:'font_picker',id:`june_product_${role}_font`,label:'Font family',default:role==='subheading'?'poppins_n4':'poppins_n9'});
 for(const [key,label,min,max,step,def,unit] of [['weight','Font weight',100,900,100,role==='subheading'?400:900],['size','Desktop size',16,64,1,size,'px'],['mobile','Mobile size',16,48,1,mobile,'px'],['tracking','Letter spacing / 100 em',-5,10,1,-3],['leading','Line height / 100',100,180,5,role==='subheading'?135:110]])controls.push({type:'range',id:`june_product_${role}_${key}`,label,min,max,step,default:def,...(unit?{unit}:{})});
}
schema.push({name:'June product brand',settings:controls});write('config/settings_schema.json',JSON.stringify(schema,null,2)+'\n');
let layout=read('layout/theme.liquid');
layout=layout.replace('</head>',"{% if request.page_type == 'product' and settings.june_product_brand != false %}{% render 'june-product-brand' %}{% endif %}\n  </head>");
layout=layout.replace('<main id="MainContent"','<main {% if request.page_type == \'product\' and settings.june_product_brand != false %}data-june-product-brand{% endif %} id="MainContent"');write('layout/theme.liquid',layout);
let snippet="{% doc %}\nProduct-only brand roles; shared master settings, no cart or header selectors.\n{% enddoc %}\n{% style %}\n";
for(const [role,prefix] of [['heading','june_product'],['section','june_product'],['subheading','june_product'],['price','june_type'],['action','june_type'],['support','june_type'],['label','june_type'],['utility','june_type']]){
const key=`${prefix}_${role}`, lead=prefix==='june_type'?'leading':'leading';
snippet+=`{% assign selected_font = settings.${key}_font %}{% assign requested_weight = settings.${key}_weight | append: '' %}{% assign face = selected_font | font_modify: 'weight', requested_weight | default: selected_font %}{{ face | font_face: font_display: 'swap' }}\n#MainContent[data-june-product-brand]{--jpb-${role}-font:{{ selected_font.family }},{{ selected_font.fallback_families }};--jpb-${role}-weight:{{ settings.${key}_weight }};--jpb-${role}-size:{{ settings.${key}_size }}px;--jpb-${role}-mobile:{{ settings.${key}_mobile }}px;--jpb-${role}-tracking:{{ settings.${key}_tracking | divided_by: 100.0 }}em;--jpb-${role}-leading:{{ settings.${key}_${lead} | divided_by: 100.0 }};}\n`;
}
snippet+="{% endstyle %}\n{{ 'june-product-brand.css' | asset_url | stylesheet_tag }}\n";write('snippets/june-product-brand.liquid',snippet);
const scope='#MainContent[data-june-product-brand]'; let css='/* Product-only presentation. No form, event, variant or checkout changes. */\n';
function rule(sel,body){css+=`${scope} ${sel}{${body}}\n`}
const roles={heading:'h1,.tjs-planner-title,.tjs-wedding-title,.tjs-pdp-title__heading',section:'h2',subheading:'.tjs-planner-tagline,.tjs-wedding-tagline,h3:not(.hdt-card-product__title)',support:'p,.tjs-planner-subline,.tjs-wedding-subline,[class$="-subtitle"],[class$="-copy"],[class$="-content-text"],.tjs-product-tabs__content',action:'button,summary,.tjs-cover-gallery-button,.hdt-btn',label:'label,[class$="-kicker"],[class$="__label"],[class$="-label"]',utility:'[class$="-note"],[class$="-subnote"],[class$="-usp-text"],[class$="__hint"]',price:'.tjs-planner-current-price,.tjs-price-reveal__price,.hdt-price,.tjs-cover-gallery-price,.tjs-mini-live,.tjs-mv4-tier__price,[data-mystery-bind="price"]'};
for(const [role,sel] of Object.entries(roles)){
 rule(`:is(${sel})`,`font-family:var(--jpb-${role}-font)!important;font-weight:var(--jpb-${role}-weight)!important;font-size:var(--jpb-${role}-size)!important;letter-spacing:var(--jpb-${role}-tracking)!important;line-height:var(--jpb-${role}-leading)!important;`);
 css+=`@media(max-width:749px){${scope} :is(${sel}){font-size:var(--jpb-${role}-mobile)!important}}\n`;
}
rule(':is(h1,h2,.tjs-planner-title,.tjs-wedding-title,.tjs-pdp-title__heading)','font-stretch:normal!important;scale:1!important;text-transform:none!important;overflow-wrap:break-word;color:var(--june-ink,#171717)');
rule(':is(.tjs-planner-title,.tjs-wedding-title,.tjs-pdp-title__text)::after','display:none!important');
rule(':is(.tjs-planner-current-price,.tjs-price-reveal__price,.hdt-price,.tjs-mini-live,.tjs-mv4-tier__price,[data-mystery-bind="price"])','display:inline-block;color:var(--june-ink,#171717)!important');
rule(':is(.tjs-planner-current-price,.tjs-price-reveal__price,.tjs-mv4-tier__price,[data-mystery-bind="price"])::first-letter','font-size:.58em;vertical-align:super');
rule(':is(del,.hdt-compare-at-price,.tjs-planner-compare-price,.tjs-price-reveal__compare,.tjs-mini-old,.tjs-price-reveal__compare .hdt-price,del .hdt-price)','font-family:var(--jpb-support-font)!important;font-weight:400!important;font-size:12px!important;line-height:1.3!important;color:var(--june-muted,#656565)!important');
const primary='.tjs-planner-atc-btn,.tjs-wedding-atc-btn,.tjs-atc-row__button,.hdt-product-form__submit,.hdt-sticky-atc__submit,.tjs-mv4-cta,.tjs-mv4-sticky__button';
rule(`:is(${primary})`,'position:relative;min-height:50px!important;border-radius:999px!important;border:1.5px solid var(--june-ink,#171717)!important;background:var(--june-accent,#bfaee8)!important;color:var(--june-on-accent,#171717)!important;box-shadow:-2px 2px 0 var(--june-ink,#171717)!important;padding-inline:20px 52px!important;animation:none!important');
rule(`:is(${primary})::before`,'display:none!important');
const arrow='data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"%3E%3Ccircle cx="16" cy="16" r="16" fill="%23171717"/%3E%3Cpath d="M10 16h12m-5-5 5 5-5 5" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/%3E%3C/svg%3E';
rule(`:is(${primary})::after`,`content:''!important;position:absolute!important;inset:50% 10px auto auto!important;transform:translateY(-50%)!important;width:32px!important;height:32px!important;border:0!important;border-radius:50%;background:url('${arrow}') center/contain no-repeat!important;pointer-events:none;opacity:1!important;`);
rule(':is(.tjs-planner-atc-btn__icon,.tjs-wedding-atc-btn__icon,.tjs-atc-row__button-icon,.tjs-mv4-cta__arrow)','display:none!important');
rule(`:is(${primary}):disabled`,'opacity:.5!important;cursor:not-allowed');
rule(':is(.tjs-cover-gallery-button,.hdt-product__description a,.tjs-product-tabs__content a)','text-underline-offset:4px');
rule(':is(.tjs-planner-variant-pill,.tjs-variant-picker__btn,.tjs-main-character-tab,.tjs-wedding-planning-tab)','border-color:var(--june-border,#ddd)!important;box-shadow:none!important;min-height:44px');
rule(':is(.tjs-planner-variant-option input:checked + .tjs-planner-variant-pill,.tjs-variant-picker__btn.is-active,.tjs-main-character-tab.is-active,.tjs-wedding-planning-tab.is-active)','background:var(--june-accent,#bfaee8)!important;color:var(--june-on-accent,#171717)!important;border-color:var(--june-ink,#171717)!important');
rule(':is(.tjs-cover-option.is-active,.tjs-cover-option[aria-current="true"])','outline:2px solid var(--june-accent,#bfaee8);outline-offset:2px');
rule(':focus-visible','outline:2px solid var(--june-ink,#171717)!important;outline-offset:4px');
rule(':is(input:not([type="hidden"]):not([type="radio"]):not([type="checkbox"]),textarea,select)','font-family:var(--jpb-support-font);font-size:16px');
const qty='.tjs-planner-qty-control,.tjs-wedding-qty-control,.tjs-qty-selector__box,.hdt-product__form-qty';
rule(`:is(${qty})`,'display:inline-flex!important;align-items:center;justify-content:center;gap:0!important;width:124px!important;min-width:124px!important;height:46px!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;overflow:visible!important;isolation:isolate');
const qtybtn='.tjs-planner-qty-btn,.tjs-wedding-qty-btn,.tjs-qty-selector__btn,.hdt-product__form-qty .hdt-quantity__button';
rule(`:is(${qtybtn})`,'position:relative!important;inset:auto!important;flex:0 0 44px!important;width:44px!important;height:44px!important;padding:14px!important;border:0!important;border-radius:50%!important;background:transparent!important;box-shadow:none!important;display:grid!important;place-items:center;z-index:1;font-size:16px!important');
rule(`:is(${qtybtn})::before`,"content:'';position:absolute;inset:5.5px;border:1px solid var(--june-border,#ddd);border-radius:50%;background:var(--june-bg,#fff);z-index:-1");
rule(':is(.tjs-planner-qty-number,.tjs-wedding-qty-number,.tjs-qty-selector__input,.hdt-product__form-qty .hdt-quantity__input)','position:relative!important;inset:auto!important;display:grid;place-items:center;width:34.5px!important;min-width:34.5px!important;flex:0 0 34.5px!important;height:34.5px!important;padding:0!important;text-align:center;border:1.125px solid var(--june-ink,#171717)!important;border-radius:3.75px!important;background:var(--june-bg,#fff)!important;color:var(--june-ink,#171717)!important;box-shadow:2.25px 2.25px 0 var(--june-bg,#fff),3px 3px 0 var(--june-ink,#171717),5.25px 5.25px 0 var(--june-accent,#bfaee8)!important;transform:rotate(-3deg)!important;font:600 16px/1 var(--jpb-action-font)!important;appearance:textfield');
rule('input[type="number"]::-webkit-inner-spin-button','appearance:none;margin:0');
rule('input[type="number"]::-webkit-outer-spin-button','appearance:none;margin:0');
rule(':is(.hdt-card-product__title,.tjs-cover-gallery-product-title)','font-family:var(--jpb-action-font)!important;font-size:14px!important;line-height:1.4!important');
rule(':is(.hdt-card-product .hdt-price,.tjs-cover-gallery-price,.tjs-mv4-sticky__price)','font-size:22px!important');
css+=`@media(prefers-reduced-motion:reduce){${scope} :is(${primary}){transition:none!important}}\n`;
rule(':is(.tjs-lead,.tjs-body)','font-family:var(--jpb-support-font)!important;font-size:var(--jpb-support-size)!important;line-height:var(--jpb-support-leading)!important');
rule(':is(.tjs-tier__price,.tjs-sum strong)','font-family:var(--jpb-price-font)!important;font-weight:var(--jpb-price-weight)!important;font-size:var(--jpb-price-size)!important');
rule(':is(.tjs-atc,.tjs-sticky-atc)','background:var(--june-accent,#bfaee8)!important;color:var(--june-on-accent,#171717)!important;border:1.5px solid var(--june-ink,#171717)!important;border-radius:999px!important;min-height:50px');
rule(':is(.tjs-tier.is-selected,.tjs-mv4-tier.is-selected)','border-color:var(--june-ink,#171717)!important;background:var(--june-accent,#bfaee8)!important;color:var(--june-on-accent,#171717)!important');
write('assets/june-product-brand.css',css);
fs.writeFileSync(path.join(root,'changed.json'),JSON.stringify(['config/settings_schema.json','layout/theme.liquid','snippets/june-product-brand.liquid','assets/june-product-brand.css'],null,2));
