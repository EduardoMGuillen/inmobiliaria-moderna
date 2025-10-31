const { put, head, del, list, get } = require('@vercel/blob');

const ADMIN_PASSWORD = 'inmomoderna2025';
const BLOB_NAME = 'properties.json';

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

function allowCors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-token');
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }
  return false;
}

async function readAllProperties() {
  try {
    const { url } = await get(BLOB_NAME);
    if (!url) return [];
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

async function writeAllProperties(properties) {
  await put(BLOB_NAME, JSON.stringify(properties, null, 2), {
    contentType: 'application/json',
    access: 'public'
  });
}

function isAuthorized(req) {
  const token = req.headers['x-admin-token'];
  return token === ADMIN_PASSWORD;
}

module.exports = async (req, res) => {
  if (allowCors(req, res)) return;

  if (req.method === 'GET') {
    const properties = await readAllProperties();
    return json(res, 200, properties);
  }

  if (req.method === 'POST') {
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
    const {
      id,
      title,
      price,
      status, // 'venta' | 'renta'
      details, // array of strings
      amenities, // array of strings
      image, // main image
      images, // optional array of images
      whatsappText // optional custom message
    } = payload;

    if (!title || !price || !status || !image) {
      return json(res, 400, { error: 'Missing required fields' });
    }
    const properties = await readAllProperties();
    const newItem = {
      id: id || `${Date.now()}`,
      title,
      price,
      status,
      details: Array.isArray(details) ? details : [],
      amenities: Array.isArray(amenities) ? amenities : [],
      image,
      images: Array.isArray(images) && images.length ? images : [image],
      whatsappText: whatsappText || ''
    };
    const idx = properties.findIndex((p) => p.id === newItem.id);
    if (idx >= 0) {
      properties[idx] = newItem;
    } else {
      properties.push(newItem);
    }
    await writeAllProperties(properties);
    return json(res, 200, newItem);
  }

  if (req.method === 'DELETE') {
    if (!isAuthorized(req)) return json(res, 401, { error: 'Unauthorized' });
    const { id } = req.query || {};
    if (!id) return json(res, 400, { error: 'Missing id' });
    const properties = await readAllProperties();
    const next = properties.filter((p) => String(p.id) !== String(id));
    await writeAllProperties(next);
    return json(res, 200, { ok: true });
  }

  res.statusCode = 405;
  res.setHeader('Allow', 'GET,POST,DELETE,OPTIONS');
  res.end('Method Not Allowed');
};


