(async()=>{
  const error=document.querySelector('#reviewError'),root=document.querySelector('#albumPages');
  const value=new URLSearchParams(location.hash.slice(1)).get('review')||'',separator=value.indexOf('.'),designId=value.slice(0,separator),token=value.slice(separator+1);
  if(separator<1||!/^[-a-f0-9]{36}$/i.test(designId)||!token){error.hidden=false;error.textContent='This family preview link is incomplete.';return}
  const auth={authorization:`Bearer ${token}`};
  let draft;
  try{const response=await fetch(`/api/designs/${encodeURIComponent(designId)}/review`,{headers:auth});if(!response.ok)throw new Error('This preview link has expired or is unavailable.');({draft}=await response.json())}
  catch(reason){error.hidden=false;error.textContent=reason.message;return}
  const numeric=(value,fallback=0)=>Number.isFinite(Number(value))?Math.max(0,Math.min(100,Number(value))):fallback;
  const create=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text!=null)node.textContent=text;return node};
  document.querySelector('#albumTitle').textContent=draft.title||'Your album';
  document.querySelector('#albumDetails').textContent=`${draft.size||'Regular'} · ${draft.pages||20} pages · Read-only layout preview. Final print proof follows purchase.`;
  const cover=create('section','page-card'),coverTitle=create('h2','', 'Cover'),coverCanvas=create('div','page-canvas cover'),coverImage=create('img');
  coverImage.src=draft.coverSrc||'';coverImage.alt='Album cover';coverCanvas.append(coverImage);
  const coverFrames={1:[[315,270,270,360]],2:[[180,260,230,350],[490,260,230,350]],3:[[70,280,230,340],[335,280,230,340],[600,280,230,340]],4:[[220,210,205,245],[475,210,205,245],[220,475,205,245],[475,475,205,245]]};
  const countCoverPhotos=(draft.coverPhotos||[]).filter(Boolean).length;
  (draft.coverPhotos||[]).forEach((photo,index)=>{
    const frame=coverFrames[countCoverPhotos]?.[index];if(!photo?.url||!frame)return;
    const image=create('img');image.src=photo.url;image.alt=`Cover photo ${index+1}`;image.style.left=frame[0]/9+'%';image.style.top=frame[1]/9+'%';image.style.width=frame[2]/9+'%';image.style.height=frame[3]/9+'%';image.style.border='3px solid white';image.style.boxShadow='0 3px 12px #0004';coverCanvas.append(image);
  });
  coverCanvas.append(create('span','cover-label',draft.personalization?.values?.title||draft.title||''));cover.append(coverTitle,coverCanvas,create('p','page-note','Cover image and text placement are approximate in this family preview.'));root.append(cover);
  const photos=new Map((draft.photos||[]).map(photo=>[photo.id,photo]));
  const count=Math.max(0,(draft.pages||20)-2);
  for(let page=0;page<count;page++){
    const card=create('section','page-card'),title=create('h2','',`Page ${page+1}`),canvas=create('div','page-canvas');
    const background=draft.pageBackgrounds?.[page];if(background?.type==='upload'&&background.value){canvas.style.backgroundImage=`url("${background.value.replaceAll('"','%22')}")`;canvas.style.backgroundSize='cover';canvas.style.backgroundPosition='center'}
    for(const item of (draft.items||[]).filter(item=>item.page===page)){
      const photo=photos.get(item.photoId||item.photo?.id);if(!photo?.url)continue;
      const image=create('img');image.src=photo.url;image.alt=photo.name||'Album photo';image.loading='lazy';image.style.left=numeric(item.x)+'%';image.style.top=numeric(item.y)+'%';image.style.width=numeric(item.w,30)+'%';image.style.height=numeric(item.h,30)+'%';image.style.transform=`rotate(${Math.max(-180,Math.min(180,Number(item.rotation)||0))}deg)`;image.style.zIndex=String(Math.max(1,Math.min(99,Number(item.z)||1)));canvas.append(image);
    }
    for(const item of (draft.overlays||[]).filter(item=>item.page===page&&item.kind!=='sticker')){
      const caption=create('span','caption',item.content||'');caption.style.left=numeric(item.x)+'%';caption.style.top=numeric(item.y)+'%';caption.style.width=numeric(item.w,40)+'%';caption.style.height=numeric(item.h,15)+'%';caption.style.color=/^#[0-9a-f]{6}$/i.test(item.textStyle?.color||'')?item.textStyle.color:'#171717';caption.style.zIndex=String(Math.max(1,Math.min(99,Number(item.z)||1)));canvas.append(caption);
    }
    card.append(title,canvas);root.append(card);
  }
  document.querySelector('#feedback').hidden=false;
  document.querySelectorAll('[data-decision]').forEach(button=>button.onclick=async()=>{
    const status=document.querySelector('#feedbackStatus');document.querySelectorAll('[data-decision]').forEach(b=>b.disabled=true);status.textContent='Sending feedback…';
    try{const response=await fetch(`/api/designs/${encodeURIComponent(designId)}/review-response`,{method:'POST',headers:{...auth,'content-type':'application/json'},body:JSON.stringify({decision:button.dataset.decision,note:document.querySelector('#reviewNote').value})});if(!response.ok)throw new Error('Could not send feedback. Please try again.');status.textContent='Thank you. Your feedback has been sent to the album creator.'}
    catch(reason){status.textContent=reason.message;document.querySelectorAll('[data-decision]').forEach(b=>b.disabled=false)}
  });
})();
