const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.end(JSON.stringify(data));
}

function allowCors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }
  return false;
}

module.exports = async (req, res) => {
  if (allowCors(req, res)) return;

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST,OPTIONS');
    return res.end('Method Not Allowed');
  }

  // If Resend API key is not configured, return success but don't send email
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY not configured, skipping email send');
    return json(res, 200, { 
      success: true, 
      message: 'Email service not configured. Please set RESEND_API_KEY environment variable.' 
    });
  }

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

  const { to, subject, html } = payload;

  if (!to || !subject || !html) {
    return json(res, 400, { error: 'Missing required fields: to, subject, html' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Moderna Inmobiliaria <onboarding@resend.dev>', // You'll need to verify your domain with Resend
      to: [to],
      subject: subject,
      html: html
    });

    if (error) {
      console.error('Resend error:', error);
      return json(res, 500, { error: 'Failed to send email', details: error });
    }

    return json(res, 200, { success: true, id: data?.id });
  } catch (error) {
    console.error('Email send error:', error);
    return json(res, 500, { error: 'Failed to send email', details: error.message });
  }
};

