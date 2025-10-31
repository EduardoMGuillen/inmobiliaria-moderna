const { put } = require('@vercel/blob');

const ADMIN_PASSWORD = 'inmomoderna2025';

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

function allowCors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-token');
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }
  return false;
}

function isAuthorized(req) {
  const token = req.headers['x-admin-token'];
  return token === ADMIN_PASSWORD;
}

module.exports = async (req, res) => {
  if (allowCors(req, res)) return;
  if (req.method === 'GET') {
    return json(res, 200, { ok: true });
  }
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET,POST,OPTIONS');
    return res.end('Method Not Allowed');
  }
  if (!isAuthorized(req)) return json(res, 401, { error: 'Unauthorized' });

  let body = '';
  await new Promise((resolve) => {
    req.on('data', (chunk) => (body += chunk));
    req.on('end', resolve);
  });
  let payload;
  try {
    payload = JSON.parse(body || '{}');
  } catch (e) {
    return json(res, 400, { error: 'Invalid JSON' });
  }

  const { name, dataBase64 } = payload;
  if (!name || !dataBase64) return json(res, 400, { error: 'Missing name or dataBase64' });

  const match = dataBase64.match(/^data:(.*?);base64,(.*)$/);
  if (!match) return json(res, 400, { error: 'Invalid data URL' });
  const contentType = match[1] || 'application/octet-stream';
  const base64 = match[2];
  const buffer = Buffer.from(base64, 'base64');

  const safeName = name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const key = `uploads/${Date.now()}_${safeName}`;

  const { url } = await put(key, buffer, { contentType, access: 'public' });

  return json(res, 200, { url, key });
};


