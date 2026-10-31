const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const storage = require('./r2-storage.cjs');

const root = __dirname;
const port = Number(process.env.PORT || 4173);
const mime = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};
const removalJobs=new Map();
const removalHits=new Map();

function safePath(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, 'http://localhost').pathname);
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const resolved = path.resolve(root, relative);
  return resolved.startsWith(root + path.sep) ? resolved : null;
}

function json(res, status, value) {
  res.writeHead(status, {'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'});
  res.end(JSON.stringify(value));
}

function readJson(req, limit=1024*1024) {
  return new Promise((resolve,reject)=>{
    const chunks=[]; let size=0;
    req.on('data',chunk=>{size+=chunk.length;if(size>limit){reject(new Error('BODY_TOO_LARGE'));req.destroy();return}chunks.push(chunk)});
    req.on('end',()=>{try{resolve(chunks.length?JSON.parse(Buffer.concat(chunks).toString('utf8')):{})}catch{reject(new Error('INVALID_JSON'))}});
    req.on('error',reject);
  });
}

function authDesign(req) {
  const token=String(req.headers.authorization||'').replace(/^Bearer\s+/i,'');
  return storage.verify(token);
}

async function readDraftWithMedia(auth){
  const rootKey=storage.designRoot(auth.customerRef,auth.designId),key=`${rootKey}/design/current.json`;
  if(!await storage.exists(key))return null;
  const draft=JSON.parse((await storage.getBuffer(key)).toString('utf8'));
  for(const photo of [...(draft.photos||[]),...(draft.coverPhotos||[])]){
    if(typeof photo.cloudKey==='string'&&photo.cloudKey.startsWith(`${rootKey}/originals/`))photo.url=(await storage.signedDownload(photo.cloudKey)).url;
    else photo.url='';
  }
  for(const background of Object.values(draft.pageBackgrounds||{})){
    if(background?.type==='upload'&&typeof background.cloudKey==='string'&&background.cloudKey.startsWith(`${rootKey}/originals/`))background.value=(await storage.signedDownload(background.cloudKey)).url;
  }
  return draft;
}

async function api(req,res,pathname) {
  if(pathname==='/api/storage/status'&&req.method==='GET'){
    json(res,200,{configured:storage.enabled,provider:'cloudflare-r2',missing:storage.enabled?[]:storage.missing});return true;
  }
  if(pathname==='/api/designs'&&req.method==='POST'){
    if(!storage.enabled){json(res,503,{error:'STORAGE_NOT_CONFIGURED'});return true}
    const designId=crypto.randomUUID(),customerRef=`C-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const token=storage.sign({designId,customerRef,exp:Date.now()+30*24*60*60*1000});
    await storage.putJson(`${storage.designRoot(customerRef,designId)}/design/meta.json`,{designId,customerRef,status:'DRAFT',createdAt:new Date().toISOString()});
    json(res,201,{designId,customerRef,editToken:token});return true;
  }
  const uploadMatch=pathname.match(/^\/api\/designs\/([^/]+)\/uploads$/);
  if(uploadMatch&&req.method==='POST'){
    const auth=authDesign(req);if(!auth||auth.designId!==uploadMatch[1]||auth.scope==='review'){json(res,401,{error:'INVALID_DESIGN_TOKEN'});return true}
    const body=await readJson(req);const type=String(body.contentType||''),length=Number(body.contentLength||0);
    if(!['image/jpeg','image/png','image/webp','image/heic','image/heif'].includes(type)||!Number.isSafeInteger(length)||length<1||length>50*1024*1024){json(res,400,{error:'INVALID_UPLOAD'});return true}
    const upload=await storage.signedPhotoUpload({customerRef:auth.customerRef,designId:auth.designId,assetId:crypto.randomUUID(),filename:body.filename,contentType:type,contentLength:length});
    json(res,201,upload);return true;
  }
  const draftMatch=pathname.match(/^\/api\/designs\/([^/]+)\/draft$/);
  if(draftMatch&&req.method==='GET'){
    const auth=authDesign(req);if(!auth||auth.designId!==draftMatch[1]||auth.scope==='review'){json(res,401,{error:'INVALID_DESIGN_TOKEN'});return true}
    const draft=await readDraftWithMedia(auth);if(!draft){json(res,404,{error:'DRAFT_NOT_FOUND'});return true}
    json(res,200,{draft,customerRef:auth.customerRef});return true;
  }
  if(draftMatch&&req.method==='PUT'){
    const auth=authDesign(req);if(!auth||auth.designId!==draftMatch[1]||auth.scope==='review'){json(res,401,{error:'INVALID_DESIGN_TOKEN'});return true}
    const body=await readJson(req,5*1024*1024),savedAt=new Date().toISOString();
    const revision=crypto.createHash('sha256').update(JSON.stringify(body,(key,value)=>['savedAt','cloudStatus','url','revision','step','activePage','currentSpread','hasStarted'].includes(key)?undefined:value)).digest('hex');
    const saved=await storage.putJson(`${storage.designRoot(auth.customerRef,auth.designId)}/design/current.json`,{...body,designId:auth.designId,customerRef:auth.customerRef,savedAt,revision});
    json(res,200,{ok:true,savedAt,...saved});return true;
  }
  const renewMatch=pathname.match(/^\/api\/designs\/([^/]+)\/renew-edit$/);
  if(renewMatch&&req.method==='POST'){
    const auth=authDesign(req);if(!auth||auth.designId!==renewMatch[1]||auth.scope==='review'){json(res,401,{error:'INVALID_DESIGN_TOKEN'});return true}
    const editToken=storage.sign({designId:auth.designId,customerRef:auth.customerRef,exp:Date.now()+30*24*60*60*1000});
    json(res,200,{editToken,expiresInDays:30});return true;
  }
  const reviewLinkMatch=pathname.match(/^\/api\/designs\/([^/]+)\/review-link$/);
  if(reviewLinkMatch&&req.method==='POST'){
    const auth=authDesign(req);if(!auth||auth.designId!==reviewLinkMatch[1]||auth.scope==='review'){json(res,401,{error:'INVALID_DESIGN_TOKEN'});return true}
    const token=storage.sign({designId:auth.designId,customerRef:auth.customerRef,scope:'review',exp:Date.now()+7*24*60*60*1000});
    json(res,200,{token,expiresInDays:7});return true;
  }
  const reviewMatch=pathname.match(/^\/api\/designs\/([^/]+)\/review$/);
  if(reviewMatch&&req.method==='GET'){
    const auth=authDesign(req);if(!auth||auth.designId!==reviewMatch[1]||auth.scope!=='review'){json(res,401,{error:'INVALID_REVIEW_TOKEN'});return true}
    const draft=await readDraftWithMedia(auth);if(!draft){json(res,404,{error:'DRAFT_NOT_FOUND'});return true}
    json(res,200,{draft});return true;
  }
  const responseMatch=pathname.match(/^\/api\/designs\/([^/]+)\/review-response$/);
  if(responseMatch&&req.method==='POST'){
    const auth=authDesign(req);if(!auth||auth.designId!==responseMatch[1]||auth.scope!=='review'){json(res,401,{error:'INVALID_REVIEW_TOKEN'});return true}
    const body=await readJson(req),decision=String(body.decision||''),note=String(body.note||'').trim().slice(0,500);
    if(!['looks-good','changes-requested'].includes(decision)){json(res,400,{error:'INVALID_DECISION'});return true}
    const draft=await readDraftWithMedia(auth);if(!draft){json(res,404,{error:'DRAFT_NOT_FOUND'});return true}
    const response={decision,note,reviewedDraftSavedAt:draft.savedAt,reviewedRevision:draft.revision||null,createdAt:new Date().toISOString()};
    await storage.putJson(`${storage.designRoot(auth.customerRef,auth.designId)}/design/reviews/${crypto.randomUUID()}.json`,response);
    json(res,201,{ok:true,response});return true;
  }
  const responsesMatch=pathname.match(/^\/api\/designs\/([^/]+)\/review-responses$/);
  if(responsesMatch&&req.method==='GET'){
    const auth=authDesign(req);if(!auth||auth.designId!==responsesMatch[1]||auth.scope==='review'){json(res,401,{error:'INVALID_DESIGN_TOKEN'});return true}
    const responses=await storage.listJson(`${storage.designRoot(auth.customerRef,auth.designId)}/design/reviews/`);
    const current=await readDraftWithMedia(auth);
    json(res,200,{responses:responses.sort((a,b)=>b.createdAt.localeCompare(a.createdAt)),currentRevision:current?.revision||null});return true;
  }
  const removalMatch=pathname.match(/^\/api\/designs\/([^/]+)\/assets\/remove-background$/);
  if(removalMatch&&req.method==='POST'){
    const auth=authDesign(req);if(!auth||auth.designId!==removalMatch[1]||auth.scope==='review'){json(res,401,{error:'INVALID_DESIGN_TOKEN'});return true}
    if(!process.env.REMOVE_BG_API_KEY){json(res,503,{error:'BACKGROUND_REMOVAL_NOT_CONFIGURED',message:'Background removal is not configured yet.'});return true}
    const now=Date.now(),bucketKey=auth.designId,hits=(removalHits.get(bucketKey)||[]).filter(time=>now-time<60*60*1000);if(hits.length>=12){json(res,429,{error:'BACKGROUND_REMOVAL_LIMIT',message:'Background removal limit reached. Please try again later.'});return true}hits.push(now);removalHits.set(bucketKey,hits);
    const body=await readJson(req),sourceKey=String(body.sourceKey||''),rootKey=storage.designRoot(auth.customerRef,auth.designId);
    if(!sourceKey.startsWith(`${rootKey}/originals/`)){json(res,400,{error:'INVALID_SOURCE_ASSET'});return true}
    const cacheId=crypto.createHash('sha256').update(sourceKey).digest('hex').slice(0,24),derivedKey=`${rootKey}/derived/${cacheId}-no-bg.png`;
    if(await storage.exists(derivedKey)){json(res,200,await storage.signedDownload(derivedKey));return true}
    const source=await storage.getBuffer(sourceKey),form=new FormData();form.append('image_file',new Blob([source]),path.basename(sourceKey));form.append('size','auto');form.append('format','png');
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),45000);let result;
    try{result=await fetch(process.env.REMOVE_BG_API_URL||'https://api.remove.bg/v1.0/removebg',{method:'POST',headers:{'X-Api-Key':process.env.REMOVE_BG_API_KEY},body:form,signal:controller.signal})}finally{clearTimeout(timeout)}
    if(!result.ok){const detail=(await result.text()).slice(0,500);console.error('Background removal provider error',result.status,detail);json(res,result.status===402?402:502,{error:'BACKGROUND_REMOVAL_PROVIDER',message:result.status===402?'Background removal credits are unavailable.':'The image could not be processed. Try another photo.'});return true}
    const output=Buffer.from(await result.arrayBuffer());await storage.putBuffer(derivedKey,output,'image/png');json(res,200,await storage.signedDownload(derivedKey));return true;
  }
  return false;
}

const server = http.createServer(async (req, res) => {
  const pathname=new URL(req.url||'/', 'http://localhost').pathname;
  try{if(await api(req,res,pathname))return}catch(error){console.error('API error',error);if(!res.headersSent)json(res,error.message==='BODY_TOO_LARGE'?413:500,{error:'STORAGE_REQUEST_FAILED'});else res.end();return}
  if (req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
    res.end('{"ok":true}');
    return;
  }

  const file = safePath(req.url || '/');
  if (!file) {
    res.writeHead(400);
    res.end('Bad request');
    return;
  }

  fs.stat(file, (statError, stats) => {
    const target = !statError && stats.isFile() ? file : path.join(root, 'index.html');
    fs.readFile(target, (readError, body) => {
      if (readError) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = path.extname(target).toLowerCase();
      const immutable = target.includes(`${path.sep}assets${path.sep}`);
      res.writeHead(200, {
        'content-type': mime[ext] || 'application/octet-stream',
        'cache-control': immutable ? 'public, max-age=86400' : 'no-cache',
        'x-content-type-options': 'nosniff',
        'referrer-policy': 'strict-origin-when-cross-origin'
      });
      if (req.method === 'HEAD') res.end(); else res.end(body);
    });
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`June Photo Studio listening on ${port}`);
});
