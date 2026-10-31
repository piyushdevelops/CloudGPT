const fs=require('fs');let s=fs.readFileSync('app.js','utf8');const start=s.indexOf('function renderAlbumPage('),end=s.indexOf('\nfunction bindPhotoGestures',start),old=s.slice(start,end),pos=old.indexOf('overlays.forEach(item=>'),prefix=old.slice(0,pos);const main=prefix+'overlays.forEach(item=>renderOverlay(pageElement,item))}';const helper=`
function renderOverlay(pageElement,item){
  const layer=document.createElement('div');
  layer.className=\`design-layer layer-\${item.kind}\`+(item.id===state.selectedOverlayId?' selected':'');
  layer.dataset.overlayId=item.id;
  layer.style.cssText=\`left:\${item.x}%;top:\${item.y}%;width:\${item.w}%;height:\${item.h}%;transform:rotate(\${item.rotation||0}deg)\`;
  if(item.kind==='sticker'){
    layer.innerHTML=\`\${stickerMarkup(item.content)}<i class="layer-move-handle" aria-label="Move illustration">↕</i><i class="resize-handle" aria-label="Resize illustration"></i>\`;
  }else{
    layer.innerHTML=\`<i class="layer-move-handle" aria-label="Move text">↕</i><span contenteditable="true" role="textbox" aria-label="Edit \${item.kind}" spellcheck="true">\${item.content}</span><i class="resize-handle" aria-label="Resize text"></i>\`;
    const editor=layer.querySelector('[contenteditable]');
    editor.addEventListener('pointerdown',e=>{e.stopPropagation();selectOverlay(item.id,layer)});
    editor.addEventListener('click',e=>e.stopPropagation());
    editor.addEventListener('input',()=>{item.content=editor.textContent});
    editor.addEventListener('blur',()=>{item.content=editor.textContent.trim()||'Add your text'});
  }
  layer.addEventListener('pointerdown',e=>{if(e.target.closest('[contenteditable]'))return;const mode=e.target.classList.contains('resize-handle')?'resize':'move';beginOverlayManipulation(e,item,layer,mode)});
  layer.addEventListener('click',e=>{e.stopPropagation();selectOverlay(item.id,layer)});
  enablePinch(layer,item);pageElement.append(layer);
}
function selectOverlay(id,layer){state.selectedOverlayId=id;state.selectedItemId=null;document.querySelectorAll('.design-layer').forEach(x=>x.classList.toggle('selected',Number(x.dataset.overlayId)===id));document.querySelector('#contextToolbar').hidden=true;document.querySelector('#layerOrderMenu').hidden=true;document.querySelector('#pageToolbar').hidden=true;if(layer)layer.classList.add('selected')}
`;s=s.slice(0,start)+main+helper+s.slice(end);fs.writeFileSync('app.js',s);console.log('replaced',old.length,'chars');
