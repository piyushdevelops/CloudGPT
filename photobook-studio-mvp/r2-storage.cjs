const crypto = require('crypto');
const { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const required = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME', 'STORAGE_SIGNING_SECRET'];
const missing = required.filter(name => !process.env[name]);
const enabled = missing.length === 0;
const bucket = process.env.R2_BUCKET_NAME || '';
const client = enabled ? new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
  }
}) : null;

function base64url(value) {
  return Buffer.from(value).toString('base64url');
}

function sign(payload) {
  const body = base64url(JSON.stringify(payload));
  const signature = crypto.createHmac('sha256', process.env.STORAGE_SIGNING_SECRET).update(body).digest('base64url');
  return `${body}.${signature}`;
}

function verify(token) {
  if (!enabled || typeof token !== 'string') return null;
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;
  const expected = crypto.createHmac('sha256', process.env.STORAGE_SIGNING_SECRET).update(body).digest();
  let received;
  try { received = Buffer.from(signature, 'base64url'); } catch { return null; }
  if (received.length !== expected.length || !crypto.timingSafeEqual(received, expected)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    return payload.exp > Date.now() ? payload : null;
  } catch { return null; }
}

function cleanName(name) {
  return String(name || 'photo').normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 100) || 'photo';
}

function designRoot(customerRef, designId) {
  return `photo-books/${customerRef}/${designId}`;
}

async function putJson(key, value) {
  const body = JSON.stringify(value);
  await client.send(new PutObjectCommand({Bucket: bucket, Key: key, Body: body, ContentType: 'application/json', CacheControl: 'no-store'}));
  return {key, bytes: Buffer.byteLength(body)};
}

async function signedPhotoUpload({customerRef, designId, assetId, filename, contentType, contentLength}) {
  const key = `${designRoot(customerRef, designId)}/originals/${assetId}-${cleanName(filename)}`;
  const command = new PutObjectCommand({Bucket: bucket, Key: key, ContentType: contentType, Metadata: {designid: designId, customerref: customerRef, declaredbytes: String(contentLength)}});
  const url = await getSignedUrl(client, command, {expiresIn: 900});
  return {key, url, expiresIn: 900};
}

async function exists(key) {
  try { await client.send(new HeadObjectCommand({Bucket: bucket, Key: key})); return true; } catch (error) { if (error?.$metadata?.httpStatusCode === 404 || error?.name === 'NotFound') return false; throw error; }
}

async function getBuffer(key) {
  const response=await client.send(new GetObjectCommand({Bucket:bucket,Key:key}));
  return Buffer.from(await response.Body.transformToByteArray());
}

async function listJson(prefix){
  const result=await client.send(new ListObjectsV2Command({Bucket:bucket,Prefix:prefix,MaxKeys:100}));
  return Promise.all((result.Contents||[]).map(async object=>JSON.parse((await getBuffer(object.Key)).toString('utf8'))));
}

async function putBuffer(key, body, contentType='application/octet-stream') {
  await client.send(new PutObjectCommand({Bucket:bucket,Key:key,Body:body,ContentType:contentType,CacheControl:'private, max-age=31536000'}));
  return {key,bytes:body.length};
}

async function signedDownload(key, expiresIn=7*24*60*60) {
  const url=await getSignedUrl(client,new GetObjectCommand({Bucket:bucket,Key:key}),{expiresIn});
  return {key,url,expiresIn};
}

module.exports = {enabled, missing, sign, verify, putJson, putBuffer, getBuffer, listJson, signedDownload, signedPhotoUpload, designRoot, exists};
