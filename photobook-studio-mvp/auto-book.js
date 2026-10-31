(()=>{
  'use strict';
  const api=window.JuneStudio;
  const dialog=document.querySelector('#autoBookDialog');
  if(!api||!dialog)return;

  const $=selector=>document.querySelector(selector);
  const setup=$('#autoBookSetup'),results=$('#autoBookResults'),versionList=$('#autoVersionList');
  const labels={timeline:'Timeline',highlights:'Highlights first',upload:'Upload order',spacious:'Spacious',balanced:'Balanced',lively:'Lively',editorial:'Clean editorial',keepsake:'Warm keepsake',scrapbook:'Playful scrapbook'};
  const prefs={order:'timeline',density:'balanced',style:'editorial'};
  const rotations={order:['timeline','highlights','upload'],density:['spacious','balanced','lively'],style:['editorial','keepsake','scrapbook']};
  const variantNames=['Quiet Story','Modern Rhythm','Collected Moments'];
  const backgrounds={editorial:['none','none','wash','none','none','waves'],keepsake:['wash','daisies','petals','postcard','hearts','botanical'],scrapbook:['confetti','checks','pop','blobs','rainbow','doodle']};
  const frames={editorial:['clean','clean','soft'],keepsake:['soft','polaroid','clean'],scrapbook:['polaroid','film','soft','clean']};

  function next(value,key,offset=1){const values=rotations[key],index=Math.max(0,values.indexOf(value));return values[(index+offset)%values.length]}
  function seeded(seed,index,mod){return Math.abs((seed*1103515245+(index+1)*12345)>>>0)%mod}
  function score(photo){return (photo.width||1)*(photo.height||1)}
  function orderedPhotos(order){
    const photos=[...api.state.photos];
    if(order==='upload')return photos.sort((a,b)=>(a.uploadIndex??0)-(b.uploadIndex??0));
    const timeline=photos.sort((a,b)=>(a.capturedAt??a.uploadIndex??0)-(b.capturedAt??b.uploadIndex??0)||(a.uploadIndex??0)-(b.uploadIndex??0));
    if(order!=='highlights')return timeline;
    const groups=[];for(let i=0;i<timeline.length;i+=5)groups.push(timeline.slice(i,i+5).sort((a,b)=>score(b)-score(a)));
    return groups.flat();
  }
  function distribute(total,pageCount,density,seed){
    const counts=Array(pageCount).fill(0),max=density==='spacious'?2:density==='lively'?4:3;
    for(let i=0;i<Math.min(total,pageCount);i++)counts[i]=1;
    let remaining=Math.max(0,total-pageCount),cursor=seed%pageCount,guard=0;
    while(remaining&&guard++<500){if(counts[cursor]<max){counts[cursor]++;remaining--}cursor=(cursor+(density==='lively'?2:3))%pageCount}
    cursor=0;while(remaining){counts[cursor%pageCount]++;remaining--;cursor++}
    return counts;
  }
  function slots(count,page,seed,density){
    const flip=seeded(seed,page,2),wide=seeded(seed+7,page,3)===0;
    if(count<=1)return [{x:4,y:4,w:92,h:92}];
    if(count===2)return wide?[{x:4,y:4,w:92,h:44},{x:4,y:52,w:92,h:44}]:[{x:4,y:4,w:44,h:92},{x:52,y:4,w:44,h:92}];
    if(count===3){
      if(density==='lively'&&flip)return [{x:4,y:4,w:44,h:44},{x:52,y:4,w:44,h:44},{x:4,y:52,w:92,h:44}];
      return flip?[{x:4,y:4,w:44,h:92},{x:52,y:4,w:44,h:44},{x:52,y:52,w:44,h:44}]:[{x:4,y:4,w:92,h:54},{x:4,y:62,w:44,h:34},{x:52,y:62,w:44,h:34}];
    }
    return [{x:4,y:4,w:44,h:44},{x:52,y:4,w:44,h:44},{x:4,y:52,w:44,h:44},{x:52,y:52,w:44,h:44}];
  }
  function makeVariant(options,index,seed){
    const photos=orderedPhotos(options.order),pageCount=Math.max(1,api.state.pages-2),counts=distribute(photos.length,pageCount,options.density,seed);
    let photoIndex=0;const items=[],pageBackgrounds={};
    counts.forEach((count,page)=>{
      const layout=slots(count,page,seed,options.density);
      for(let slot=0;slot<count&&photoIndex<photos.length;slot++,photoIndex++){
        const photo=photos[photoIndex],box=layout[slot%layout.length];
        items.push({photoId:photo.id,page,...box,preset:'free',zoom:100,focus:'center',fit:'cover',rotation:options.style==='scrapbook'&&count>1?(slot%2?-1.5:1.5):0,flipX:false,flipY:false,z:slot+1,locked:false,frame:frames[options.style][seeded(seed+page,slot,frames[options.style].length)],adjustments:options.style==='keepsake'?{warmth:9,saturation:-4}:options.style==='scrapbook'?{saturation:8}:{}});
      }
      const palette=backgrounds[options.style],value=palette[seeded(seed,page,palette.length)];
      if(value!=='none')pageBackgrounds[page]={type:'preset',value};
    });
    return {id:`auto-${Date.now()}-${index}-${seed}`,name:variantNames[index],tagline:index===0?'Closest to your choices':index===1?'A different pace and finish':'The boldest alternative',options,seed,items,pageBackgrounds,overlays:[],photoCount:photos.length,pageCount};
  }
  function buildVersions(mode='all'){
    const base={...prefs},seed=(api.state.photos.length*97+api.state.pages*13+Date.now()%997)|0;
    let options;
    if(mode==='order')options=rotations.order.map(order=>({...base,order}));
    else if(mode==='layout')options=rotations.density.map(density=>({...base,density}));
    else if(mode==='style')options=rotations.style.map(style=>({...base,style}));
    else options=[base,{order:base.order,density:next(base.density,'density'),style:next(base.style,'style')},{order:next(base.order,'order'),density:next(base.density,'density',2),style:next(base.style,'style',2)}];
    const variants=options.map((option,index)=>makeVariant(option,index,seed+index*41));
    api.state.autoBook={preferences:{...prefs},selectedVariantId:api.state.autoBook?.selectedVariantId||null,generatedAt:Date.now(),variants};
    api.queueDraftSave(0);renderVersions();showResults();return variants;
  }
  function miniature(variant,page){
    const photos=new Map(api.state.photos.map(photo=>[photo.id,photo]));
    const pieces=variant.items.filter(item=>item.page===page).map(item=>{const photo=photos.get(item.photoId);return `<i style="left:${item.x}%;top:${item.y}%;width:${item.w}%;height:${item.h}%"><img src="${photo?.url||''}" alt=""></i>`}).join('');
    const bg=variant.pageBackgrounds[page]?.value||'none';return `<span class="auto-mini-page bg-${bg}">${pieces}</span>`;
  }
  function renderVersions(){
    const variants=api.state.autoBook?.variants||[];
    versionList.innerHTML=variants.map((variant,index)=>{
      const heroes=new Set(variant.items.filter(x=>x.w>80&&x.h>80).map(x=>x.page)).size;
      return `<article class="auto-version-card ${api.state.autoBook?.selectedVariantId===variant.id?'selected':''}"><div class="auto-version-preview">${[0,1,2].map(page=>miniature(variant,page)).join('')}</div><div class="auto-version-body"><span class="auto-version-number">0${index+1}</span><div><h4>${variant.name}</h4><p>${variant.tagline}</p></div></div><div class="auto-version-tags"><span>${labels[variant.options.order]}</span><span>${labels[variant.options.density]}</span><span>${labels[variant.options.style]}</span></div><small>${variant.photoCount} photos · ${heroes} hero pages · every page editable</small><button data-auto-use="${variant.id}">Use this version <span>→</span></button></article>`;
    }).join('');
    versionList.querySelectorAll('[data-auto-use]').forEach(button=>button.onclick=()=>applyVariant(button.dataset.autoUse));
  }
  function showSetup(){setup.hidden=false;results.hidden=true;dialog.scrollTop=0}
  function showResults(){setup.hidden=true;results.hidden=false;dialog.scrollTop=0}
  function open(){updateEligibility();if(api.state.photos.length<30)return;api.state.autoBook?.variants?.length?(renderVersions(),showResults()):showSetup();dialog.showModal()}
  function clone(value){return structuredClone(value)}
  function hydrateItems(items){const photos=new Map(api.state.photos.map(photo=>[photo.id,photo]));return items.map(source=>({...clone(source),id:api.state.nextItemId++,photo:photos.get(source.photoId)})).filter(item=>item.photo)}
  function applyVariant(id){
    const state=api.state,variant=state.autoBook?.variants?.find(item=>item.id===id);if(!variant)return false;
    const locked=new Set(state.lockedPages||[]),keptItems=state.items.filter(item=>locked.has(item.page)),keptOverlays=state.overlays.filter(item=>locked.has(item.page));
    const lockedPhotoIds=new Set(keptItems.map(item=>item.photo.id)),candidateSlots=variant.items.filter(item=>!locked.has(item.page)),seen=new Set(),usable=[] ,empty=[];
    candidateSlots.forEach(item=>{if(lockedPhotoIds.has(item.photoId)||seen.has(item.photoId))empty.push(item);else{seen.add(item.photoId);usable.push(item)}});
    const missing=state.photos.filter(photo=>!lockedPhotoIds.has(photo.id)&&!seen.has(photo.id));
    missing.slice(0,empty.length).forEach((photo,index)=>usable.push({...empty[index],photoId:photo.id}));
    missing.slice(empty.length).forEach(photo=>{
      const available=Array.from({length:state.pages-2},(_,page)=>page).filter(page=>!locked.has(page)).sort((a,b)=>usable.filter(item=>item.page===a).length-usable.filter(item=>item.page===b).length);
      const page=available.find(candidate=>usable.filter(item=>item.page===candidate).length<4)??available[0],onPage=usable.filter(item=>item.page===page),layout=slots(onPage.length+1,page,variant.seed,variant.options.density);
      onPage.forEach((item,index)=>Object.assign(item,layout[index]));
      const template=variant.items.find(item=>item.page===page)||variant.items[0];usable.push({...clone(template),...layout[onPage.length],page,photoId:photo.id,z:onPage.length+1});
    });
    const reflow=page=>{const onPage=usable.filter(item=>item.page===page),layout=slots(onPage.length,page,variant.seed,variant.options.density);onPage.forEach((item,index)=>Object.assign(item,layout[index],{z:index+1}))};
    Array.from({length:state.pages-2},(_,page)=>page).filter(page=>!locked.has(page)&&!usable.some(item=>item.page===page)).forEach(page=>{const donor=Array.from({length:state.pages-2},(_,candidate)=>candidate).filter(candidate=>!locked.has(candidate)&&usable.filter(item=>item.page===candidate).length>1).sort((a,b)=>usable.filter(item=>item.page===b).length-usable.filter(item=>item.page===a).length)[0];if(donor===undefined)return;const moved=usable.filter(item=>item.page===donor).at(-1);moved.page=page;reflow(donor);reflow(page)});
    state.items=[...keptItems,...hydrateItems(usable)];
    state.overlays=[...keptOverlays];
    const pageBackgrounds={};for(let page=0;page<state.pages-2;page++){if(locked.has(page)){if(state.pageBackgrounds[page])pageBackgrounds[page]=state.pageBackgrounds[page]}else if(variant.pageBackgrounds[page])pageBackgrounds[page]=clone(variant.pageBackgrounds[page])}
    state.pageBackgrounds=pageBackgrounds;state.designMode='quick';state.activePage=0;state.currentSpread=0;state.selectedItemId=null;state.selectedOverlayId=null;state.autoBook.selectedVariantId=id;
    api.renderPrice();api.renderSpread();api.clearSelection(true);api.queueDraftSave(0);window.dispatchEvent(new CustomEvent('june:studio-open'));updateEligibility();dialog.close();return true;
  }
  function variantPage(variant,page){return variant.items.filter(item=>item.page===page)}
  function regeneratePage(page=api.state.activePage){
    const state=api.state;if((state.lockedPages||[]).includes(page))return false;
    const variants=state.autoBook?.variants||[];if(!variants.length)return false;
    const current=Math.max(0,variants.findIndex(item=>item.id===state.autoBook.selectedVariantId)),source=variants[(current+1)%variants.length],existing=state.items.filter(item=>item.page===page),layout=slots(existing.length,page,source.seed+17,source.options.density);
    const replacement=existing.map((item,index)=>({...layout[index%layout.length],photoId:item.photo.id,page,preset:'free',zoom:item.zoom||100,focus:item.focus||'center',fit:item.fit||'cover',rotation:source.options.style==='scrapbook'&&existing.length>1?(index%2?-1.5:1.5):0,flipX:false,flipY:false,z:index+1,locked:false,frame:frames[source.options.style][seeded(source.seed+page,index,frames[source.options.style].length)],adjustments:source.options.style==='keepsake'?{warmth:9,saturation:-4}:source.options.style==='scrapbook'?{saturation:8}:{}}));
    state.items=state.items.filter(item=>item.page!==page).concat(hydrateItems(replacement));
    state.overlays=state.overlays.filter(item=>item.page!==page);
    if(source.pageBackgrounds[page])state.pageBackgrounds[page]=clone(source.pageBackgrounds[page]);else delete state.pageBackgrounds[page];
    api.renderSpread();api.queueDraftSave(0);window.dispatchEvent(new CustomEvent('june:studio-open'));return true;
  }
  function togglePageLock(page=api.state.activePage){const state=api.state,set=new Set(state.lockedPages||[]);set.has(page)?set.delete(page):set.add(page);state.lockedPages=[...set].sort((a,b)=>a-b);api.renderSpread();api.queueDraftSave(0);return set.has(page)}
  function updateEligibility(){
    const count=api.state.photos.length,remaining=Math.max(0,30-count),button=$('#openAutoCreate'),progress=$('#autoCreateProgress'),meter=$('#autoCreateMeter');
    button.disabled=count<30;meter.style.width=`${Math.min(100,count/30*100)}%`;
    if(count<30){progress.textContent=`${count} of 30 photos · add ${remaining} more to unlock automatic creation.`;button.firstChild.textContent='Auto-create album '}
    else if(api.state.autoBook?.selectedVariantId){progress.textContent='Your auto-created draft is active. Locked pages stay unchanged.';button.firstChild.textContent='Change auto version '}
    else{progress.textContent=`${count} photos ready · create three complete album directions.`;button.firstChild.textContent='Auto-create album '}
  }

  dialog.querySelectorAll('[data-auto-group]').forEach(group=>group.querySelectorAll('[data-auto-value]').forEach(button=>button.onclick=()=>{group.querySelectorAll('button').forEach(item=>item.classList.remove('active'));button.classList.add('active');prefs[group.dataset.autoGroup]=button.dataset.autoValue}));
  $('#openAutoCreate').onclick=open;$('#closeAutoBook').onclick=()=>dialog.close();$('#generateAutoVersions').onclick=()=>buildVersions('all');$('#editAutoChoices').onclick=showSetup;
  dialog.querySelectorAll('[data-auto-remix]').forEach(button=>button.onclick=()=>buildVersions(button.dataset.autoRemix));
  window.addEventListener('june:photos-changed',updateEligibility);window.addEventListener('june:draft-loaded',()=>{Object.assign(prefs,api.state.autoBook?.preferences||{});updateEligibility()});
  window.addEventListener('june:studio-open',updateEligibility);updateEligibility();
  window.JuneAutoBook={open,generateVersions:buildVersions,applyVariant,regeneratePage,togglePageLock,updateEligibility};
})();
