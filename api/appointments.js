const { put, get, list, del } = require('@vercel/blob');

const ADMIN_PASSWORD = 'inmomoderna2025';
const BLOB_NAME = 'appointments.json';
const ADMIN_EMAIL = 'Inmobiliariamodernahn@gmail.com';

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

async function readAllAppointments() {
  try {
    const { url } = await get(BLOB_NAME);
    if (url) {
      const res = await fetch(`${url}?ts=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      }
    }
  } catch (_) {}

  try {
    const { blobs } = await list();
    if (Array.isArray(blobs)) {
      const candidates = blobs
        .filter(b => b.pathname && (b.pathname === BLOB_NAME || b.pathname.startsWith('appointments-')));
      if (candidates.length) {
        candidates.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
        const chosen = candidates[0];
        const res = await fetch(`${chosen.url}?ts=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          return Array.isArray(data) ? data : [];
        }
      }
    }
  } catch (_) {}
  return [];
}

async function writeAllAppointments(appointments) {
  await put(BLOB_NAME, JSON.stringify(appointments, null, 2), {
    contentType: 'application/json',
    access: 'public',
    addRandomSuffix: false
  });
}

function isAuthorized(req) {
  const token = req.headers['x-admin-token'];
  return token === ADMIN_PASSWORD;
}

async function sendEmail(appointment) {
  try {
    // Call the send-email API endpoint
    const emailResponse = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: ADMIN_EMAIL,
        subject: `Nueva solicitud de cita - ${appointment.name}`,
        html: `
          <h2>Nueva Solicitud de Cita</h2>
          <p><strong>Nombre:</strong> ${appointment.name}</p>
          <p><strong>Email:</strong> ${appointment.email}</p>
          <p><strong>Teléfono:</strong> ${appointment.phone}</p>
          <p><strong>Fecha:</strong> ${appointment.date}</p>
          <p><strong>Hora:</strong> ${appointment.time}</p>
          ${appointment.property ? `<p><strong>Inmueble de interés:</strong> ${appointment.property}</p>` : ''}
          ${appointment.message ? `<p><strong>Mensaje:</strong> ${appointment.message}</p>` : ''}
          <p><strong>Estado:</strong> Pendiente</p>
          <p><strong>ID de cita:</strong> ${appointment.id}</p>
          <hr>
          <p>Puedes gestionar esta cita desde el panel de administración.</p>
        `
      })
    }).catch(() => null);
    
    // If email service is not available, just log it
    if (!emailResponse || !emailResponse.ok) {
      console.log('Email service not available, appointment saved anyway');
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = async (req, res) => {
  if (allowCors(req, res)) return;

  if (req.method === 'GET') {
    const q = req.query || {};
    const includeAll = String(q.all) === '1' && isAuthorized(req);
    const appointments = await readAllAppointments();
    
    // Sort by date and time, newest first
    appointments.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateB - dateA;
    });
    
    const list = includeAll ? appointments : appointments.filter((a) => a.status !== 'rejected');
    return json(res, 200, list);
  }

  if (req.method === 'POST') {
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

    const { id, name, email, phone, date, time, property, message, status } = payload;

    // If updating status (admin action)
    if (id && status && isAuthorized(req)) {
      const appointments = await readAllAppointments();
      const existingIdx = appointments.findIndex((a) => String(a.id) === String(id));
      
      if (existingIdx >= 0) {
        const current = appointments[existingIdx];
        const updated = {
          ...current,
          status: status, // 'pending', 'accepted', 'rejected'
          updatedAt: new Date().toISOString()
        };
        appointments[existingIdx] = updated;
        await writeAllAppointments(appointments);
        
        // Send confirmation email to client if accepted
        if (status === 'accepted') {
          try {
            await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/send-email`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                to: current.email,
                subject: 'Cita Confirmada - Moderna Soluciones Inmobiliaria',
                html: `
                  <h2>Cita Confirmada</h2>
                  <p>Estimado/a ${current.name},</p>
                  <p>Su cita ha sido confirmada para:</p>
                  <p><strong>Fecha:</strong> ${current.date}</p>
                  <p><strong>Hora:</strong> ${current.time}</p>
                  ${current.property ? `<p><strong>Inmueble:</strong> ${current.property}</p>` : ''}
                  <p>Nos vemos pronto!</p>
                  <p>Moderna Soluciones Inmobiliaria</p>
                `
              })
            }).catch(() => null);
          } catch (e) {}
        }
        
        return json(res, 200, updated);
      }
      return json(res, 404, { error: 'Appointment not found' });
    }

    // Creating a new appointment (public)
    if (!name || !email || !phone || !date || !time) {
      return json(res, 400, { error: 'Missing required fields' });
    }

    const newAppointment = {
      id: id || `${Date.now()}`,
      name,
      email,
      phone,
      date,
      time,
      property: property || '',
      message: message || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const appointments = await readAllAppointments();
    appointments.push(newAppointment);
    await writeAllAppointments(appointments);

    // Send email notification to admin
    await sendEmail(newAppointment);

    return json(res, 200, newAppointment);
  }

  if (req.method === 'DELETE') {
    if (!isAuthorized(req)) return json(res, 401, { error: 'Unauthorized' });
    const { id } = req.query || {};
    if (!id) return json(res, 400, { error: 'Missing id' });
    const appointments = await readAllAppointments();
    const next = appointments.filter((a) => String(a.id) !== String(id));
    await writeAllAppointments(next);
    return json(res, 200, { ok: true, deleted: true });
  }

  res.statusCode = 405;
  res.setHeader('Allow', 'GET,POST,DELETE,OPTIONS');
  res.end('Method Not Allowed');
};

