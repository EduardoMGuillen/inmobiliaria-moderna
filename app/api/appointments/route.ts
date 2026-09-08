import { BRAND } from "@/lib/brand";
import { handleOptions, isAuthorized, jsonResponse } from "@/lib/api-helpers";
import {
  invalidateAppointmentsCache,
  readAllAppointments,
  writeAllAppointments,
} from "@/lib/appointments-store";
import type { Appointment } from "@/lib/types";

export const dynamic = "force-dynamic";

async function sendEmail(appointment: Appointment, calendarUrl: string | null = null) {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    const calendarLink = calendarUrl
      ? `<p><a href="${calendarUrl}" style="background:#c5a059; color:#000; padding:10px 20px; text-decoration:none; border-radius:8px; display:inline-block; margin-top:10px;">Agregar a Google Calendar</a></p>`
      : "";

    await fetch(`${baseUrl}/api/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: BRAND.email,
        subject: `Nueva solicitud de cita - ${appointment.name}`,
        html: `
          <h2>Nueva Solicitud de Cita</h2>
          <p><strong>Nombre:</strong> ${appointment.name}</p>
          <p><strong>Email:</strong> ${appointment.email}</p>
          <p><strong>Teléfono:</strong> ${appointment.phone}</p>
          <p><strong>Fecha:</strong> ${appointment.date}</p>
          <p><strong>Hora:</strong> ${appointment.time}</p>
          ${appointment.property ? `<p><strong>Inmueble de interés:</strong> ${appointment.property}</p>` : ""}
          ${appointment.message ? `<p><strong>Mensaje:</strong> ${appointment.message}</p>` : ""}
          <p><strong>Estado:</strong> Pendiente</p>
          <p><strong>ID de cita:</strong> ${appointment.id}</p>
          ${calendarLink}
        `,
      }),
    }).catch(() => null);
  } catch {
    /* non-blocking */
  }
}

function createGoogleCalendarEvent(appointment: Appointment) {
  const startDate = new Date(`${appointment.date}T${appointment.time}`);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  const formatDate = (date: Date) =>
    date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const title = encodeURIComponent(`Cita: ${appointment.name}`);
  const details = encodeURIComponent(
    `Cliente: ${appointment.name}\nEmail: ${appointment.email}\nTeléfono: ${appointment.phone}\n` +
      (appointment.property ? `Inmueble: ${appointment.property}\n` : "") +
      (appointment.message ? `Mensaje: ${appointment.message}\n` : "") +
      `ID: ${appointment.id}`
  );
  const location = encodeURIComponent(BRAND.name);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${details}&location=${location}`;
}

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeAll = searchParams.get("all") === "1" && isAuthorized(request);
  const appointments = await readAllAppointments();

  appointments.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateB.getTime() - dateA.getTime();
  });

  const list = includeAll ? appointments : appointments.filter((a) => a.status !== "rejected");
  return jsonResponse(list);
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  const { id, name, email, phone, date, time, property, message, status } = payload;

  if (id && status && isAuthorized(request)) {
    const appointments = await readAllAppointments();
    const existingIdx = appointments.findIndex((a) => String(a.id) === String(id));

    if (existingIdx >= 0) {
      const current = appointments[existingIdx];
      const updated: Appointment = {
        ...current,
        status: status as Appointment["status"],
        updatedAt: new Date().toISOString(),
      };
      appointments[existingIdx] = updated;
      await writeAllAppointments(appointments);
      invalidateAppointmentsCache();

      if (status === "accepted") {
        const baseUrl = process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000";
        fetch(`${baseUrl}/api/send-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: current.email,
            subject: `Cita Confirmada - ${BRAND.name}`,
            html: `
              <h2>Cita Confirmada</h2>
              <p>Estimado/a ${current.name},</p>
              <p>Su cita ha sido confirmada para:</p>
              <p><strong>Fecha:</strong> ${current.date}</p>
              <p><strong>Hora:</strong> ${current.time}</p>
              ${current.property ? `<p><strong>Inmueble:</strong> ${current.property}</p>` : ""}
              <p>Nos vemos pronto!</p>
              <p>${BRAND.name}</p>
            `,
          }),
        }).catch(() => null);
      }

      return jsonResponse(updated);
    }
    return jsonResponse({ error: "Appointment not found" }, 404);
  }

  if (!name || !email || !phone || !date || !time) {
    return jsonResponse({ error: "Missing required fields" }, 400);
  }

  const newAppointment: Appointment = {
    id: (id as string) || `${Date.now()}`,
    name: name as string,
    email: email as string,
    phone: phone as string,
    date: date as string,
    time: time as string,
    property: (property as string) || "",
    message: (message as string) || "",
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const appointments = await readAllAppointments();
  appointments.push(newAppointment);
  await writeAllAppointments(appointments);
  invalidateAppointmentsCache();

  const calendarUrl = createGoogleCalendarEvent(newAppointment);
  sendEmail(newAppointment, calendarUrl).catch(() => null);

  return jsonResponse(newAppointment);
}

export async function DELETE(request: Request) {
  if (!isAuthorized(request)) return jsonResponse({ error: "Unauthorized" }, 401);

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return jsonResponse({ error: "Missing id" }, 400);

  const appointments = await readAllAppointments();
  const next = appointments.filter((a) => String(a.id) !== String(id));
  await writeAllAppointments(next);
  return jsonResponse({ ok: true, deleted: true });
}
