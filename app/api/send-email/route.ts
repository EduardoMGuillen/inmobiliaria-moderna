import { Resend } from "resend";
import { BRAND } from "@/lib/brand";
import { jsonResponse } from "@/lib/api-helpers";

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return jsonResponse(
      {
        error: "Email service not configured. Please set RESEND_API_KEY environment variable in Vercel.",
      },
      500
    );
  }

  let payload: { to?: string; subject?: string; html?: string };
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  const { to, subject, html } = payload;
  if (!to || !subject || !html) {
    return jsonResponse({ error: "Missing required fields: to, subject, html" }, 400);
  }

  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: `${BRAND.shortName} Inmobiliaria <${fromEmail}>`,
      to: [to],
      subject,
      html,
    });

    if (error) {
      return jsonResponse({ error: "Failed to send email", details: error }, 500);
    }

    return jsonResponse({ success: true, id: data?.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return jsonResponse({ error: "Failed to send email", details: message }, 500);
  }
}
