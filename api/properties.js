const { put, head, del, list, get } = require('@vercel/blob');

const ADMIN_PASSWORD = 'inmomoderna2025';
const BLOB_NAME = 'properties.json';

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
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

// Simple in-memory cache with 5 second TTL
let cache = null;
let cacheTime = 0;
const CACHE_TTL = 5000; // 5 seconds

async function readAllProperties() {
  // Return cached data if still valid
  if (cache && (Date.now() - cacheTime) < CACHE_TTL) {
    return cache;
  }

  // Try fixed key first
  try {
    const { url } = await get(BLOB_NAME);
    if (url) {
      const res = await fetch(`${url}?ts=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const result = Array.isArray(data) ? data : [];
        cache = result;
        cacheTime = Date.now();
        return result;
      }
    }
  } catch (_) {}

  // Fallback: find latest legacy file like properties-*.json
  try {
    const { blobs } = await list();
    if (Array.isArray(blobs)) {
      const candidates = blobs
        .filter(b => b.pathname && (b.pathname === BLOB_NAME || b.pathname.startsWith('properties-')));
      if (candidates.length) {
        // Pick the most recently uploaded
        candidates.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
        const chosen = candidates[0];
        const res = await fetch(`${chosen.url}?ts=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const result = Array.isArray(data) ? data : [];
          cache = result;
          cacheTime = Date.now();
          return result;
        }
      }
    }
  } catch (_) {}
  return [];
}

async function writeAllProperties(properties) {
  await put(BLOB_NAME, JSON.stringify(properties, null, 2), {
    contentType: 'application/json',
    access: 'public',
    addRandomSuffix: false
  });
  // Invalidate cache
  cache = null;
  cacheTime = 0;
}

function isAuthorized(req) {
  const token = req.headers['x-admin-token'];
  return token === ADMIN_PASSWORD;
}

module.exports = async (req, res) => {
  if (allowCors(req, res)) return;

  if (req.method === 'GET') {
    const q = req.query || {};
    const includeAll = String(q.all) === '1' && isAuthorized(req);
    const featuredOnly = String(q.featured) === '1';
    const properties = await readAllProperties();
    let list = includeAll ? properties : properties.filter((p) => !p.hidden);
    
    if (featuredOnly) {
      list = list.filter((p) => p.featured);
    }
    
    return json(res, 200, list);
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
      category, // 'Casa' | 'Apartamento' | 'Bodega' | 'Terreno'
      status, // 'venta' | 'renta'
      department, // string
      municipio, // string
      details, // array of strings
      amenities, // array of strings
      image, // main image
      images, // optional array of images
      whatsappText, // optional custom message
      hidden, // optional boolean
      featured // optional boolean
    } = payload;

    const properties = await readAllProperties();
    const existingIdx = id != null ? properties.findIndex((p) => String(p.id) === String(id)) : -1;

    if (existingIdx >= 0) {
      const current = properties[existingIdx];
      
      // If setting featured, check if we already have 7 featured properties
      if (featured === true && !current.featured) {
        const featuredCount = properties.filter(p => p.featured && !p.hidden).length;
        if (featuredCount >= 7) {
          return json(res, 400, { error: 'Ya hay 7 inmuebles destacados. Desmarca uno antes de destacar otro.' });
        }
      }
      
      const updated = {
        ...current,
        ...(title !== undefined ? { title } : {}),
        ...(price !== undefined ? { price } : {}),
        ...(category !== undefined ? { category } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(department !== undefined ? { department } : {}),
        ...(municipio !== undefined ? { municipio } : {}),
        ...(details !== undefined ? { details: Array.isArray(details) ? details : [] } : {}),
        ...(amenities !== undefined ? { amenities: Array.isArray(amenities) ? amenities : [] } : {}),
        ...(image !== undefined ? { image } : {}),
        ...(images !== undefined ? { images: Array.isArray(images) && images.length ? images : (image ? [image] : current.images) } : {}),
        ...(whatsappText !== undefined ? { whatsappText } : {}),
        ...(hidden !== undefined ? { hidden: Boolean(hidden) } : {}),
        ...(featured !== undefined ? { featured: Boolean(featured) } : {})
      };
      properties[existingIdx] = updated;
      await writeAllProperties(properties);
      return json(res, 200, updated);
    }

    // Creating a new property requires full required fields
    if (!title || !price || !category || !status || !image || !department || !municipio) {
      return json(res, 400, { error: 'Missing required fields' });
    }
    const newItem = {
      id: id || `${Date.now()}`,
      title,
      price,
      category,
      status,
      department,
      municipio,
      details: Array.isArray(details) ? details : [],
      amenities: Array.isArray(amenities) ? amenities : [],
      image,
      images: Array.isArray(images) && images.length ? images : [image],
      whatsappText: whatsappText || '',
      hidden: Boolean(hidden),
      featured: Boolean(featured || false)
    };
    properties.push(newItem);
    await writeAllProperties(properties);
    return json(res, 200, newItem);
  }

  if (req.method === 'DELETE') {
    if (!isAuthorized(req)) return json(res, 401, { error: 'Unauthorized' });
    const { id, soft } = req.query || {};
    if (!id) return json(res, 400, { error: 'Missing id' });
    const properties = await readAllProperties();
    if (String(soft) === '1') {
      const idx = properties.findIndex((p) => String(p.id) === String(id));
      if (idx >= 0) {
        properties[idx].hidden = true;
        await writeAllProperties(properties);
      }
      return json(res, 200, { ok: true, hidden: true });
    } else {
      const next = properties.filter((p) => String(p.id) !== String(id));
      await writeAllProperties(next);
      return json(res, 200, { ok: true, deleted: true });
    }
  }

  res.statusCode = 405;
  res.setHeader('Allow', 'GET,POST,DELETE,OPTIONS');
  res.end('Method Not Allowed');
};


