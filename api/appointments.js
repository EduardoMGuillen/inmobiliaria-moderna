const { put, get, list, del } = require('@vercel/blob');

const ADMIN_PASSWORD = 'inmomoderna2025';
const BLOB_NAME = 'appointments.json';
const ADMIN_EMAIL = 'eduardomaldonadoguillen76@gmail.com';

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

async function readAllAppointments() {
  // Return cached data if still valid
  if (cache && (Date.now() - cacheTime) < CACHE_TTL) {
    return cache;
  }

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

async function writeAllAppointments(appointments) {
  await put(BLOB_NAME, JSON.stringify(appointments, null, 2), {
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

async function sendEmail(appointment, calendarUrl = null) {
  try {
    // Try to get the base URL from environment
    let baseUrl = 'http://localhost:3000';
    if (process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`;
    } else if (process.env.VERCEL) {
      baseUrl = `https://${process.env.VERCEL}`;
    }
    
    const calendarLink = calendarUrl 
      ? `<p><a href="${calendarUrl}" style="background:#4ecdc4; color:#fff; padding:10px 20px; text-decoration:none; border-radius:8px; display:inline-block; margin-top:10px;">Agregar a Google Calendar</a></p>`
      : '';
    
    // Call the send-email API endpoint
    const emailResponse = await fetch(`${baseUrl}/api/send-email`, {
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
          ${calendarLink}
          <hr>
          <p>Puedes gestionar esta cita desde el panel de administración.</p>
        `
      })
    }).catch(() => null);
    
    // If email service is not available, log it
    if (!emailResponse || !emailResponse.ok) {
      const errorText = await emailResponse?.text().catch(() => '');
      console.error('Email service error:', errorText);
      console.error('Make sure RESEND_API_KEY is set in Vercel environment variables');
    } else {
      console.log('Email sent successfully to', ADMIN_EMAIL);
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

async function createGoogleCalendarEvent(appointment) {
  try {
    if (!process.env.GOOGLE_CALENDAR_EMAIL) {
      console.log('GOOGLE_CALENDAR_EMAIL not configured, skipping calendar event');
      return;
    }

    // Create Google Calendar link
    const startDate = new Date(`${appointment.date}T${appointment.time}`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later
    
    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const title = encodeURIComponent(`Cita: ${appointment.name}`);
    const details = encodeURIComponent(
      `Cliente: ${appointment.name}\n` +
      `Email: ${appointment.email}\n` +
      `Teléfono: ${appointment.phone}\n` +
      (appointment.property ? `Inmueble: ${appointment.property}\n` : '') +
      (appointment.message ? `Mensaje: ${appointment.message}\n` : '') +
      `ID: ${appointment.id}`
    );
    const location = encodeURIComponent('Moderna Soluciones Inmobiliaria');
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${details}&location=${location}`;
    
    // For server-side creation, we'd need OAuth, but for now we can log the URL
    // In production, you'd use Google Calendar API with OAuth
    console.log('Google Calendar URL:', calendarUrl);
    
    // If you have Google Calendar API credentials, you can create the event programmatically here
    // For now, we'll just log it so you can manually add it or set up OAuth later
    
  } catch (error) {
    console.error('Error creating calendar event:', error);
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
        
        // Invalidate cache
        cache = null;
        cacheTime = 0;
        
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
    
    // Invalidate cache
    cache = null;
    cacheTime = 0;

    // Send email notification to admin and include calendar link (don't wait)
    createGoogleCalendarEvent(newAppointment).then(calendarUrl => {
      // Include calendar link in email
      return sendEmail(newAppointment, calendarUrl);
    }).catch(err => console.error('Email/Calendar error:', err));

    return json(res, 200, newAppointment);
  }

  if (req.method === 'DELETE') {
    if (!isAuthorized(req)) return json(res, 401, { error: 'Unauthorized' });
    const { id } = req.query || {};
    if (!id) return json(res, 400, { error: 'Missing id' });
    const appointments = await readAllAppointments();
    const next = appointments.filter((a) => String(a.id) !== String(id));
    await writeAllAppointments(next);
    // Cache already invalidated in writeAllAppointments
    return json(res, 200, { ok: true, deleted: true });
  }

  res.statusCode = 405;
  res.setHeader('Allow', 'GET,POST,DELETE,OPTIONS');
  res.end('Method Not Allowed');
};

