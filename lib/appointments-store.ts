import { put, head, list } from "@vercel/blob";
import type { Appointment } from "@/lib/types";

const BLOB_NAME = "appointments.json";

let cache: Appointment[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 5000;

export async function readAllAppointments(): Promise<Appointment[]> {
  if (cache && Date.now() - cacheTime < CACHE_TTL) {
    return cache;
  }

  try {
    const blob = await head(BLOB_NAME);
    if (blob?.url) {
      const res = await fetch(`${blob.url}?ts=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const result = Array.isArray(data) ? (data as Appointment[]) : [];
        cache = result;
        cacheTime = Date.now();
        return result;
      }
    }
  } catch {
    /* fallback */
  }

  try {
    const { blobs } = await list();
    const candidates = blobs.filter(
      (b) => b.pathname === BLOB_NAME || b.pathname?.startsWith("appointments-")
    );
    if (candidates.length) {
      candidates.sort(
        (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );
      const res = await fetch(`${candidates[0].url}?ts=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const result = Array.isArray(data) ? (data as Appointment[]) : [];
        cache = result;
        cacheTime = Date.now();
        return result;
      }
    }
  } catch {
    /* empty */
  }

  return [];
}

export async function writeAllAppointments(appointments: Appointment[]) {
  await put(BLOB_NAME, JSON.stringify(appointments, null, 2), {
    contentType: "application/json",
    access: "public",
    addRandomSuffix: false,
  });
  cache = null;
  cacheTime = 0;
}

export function invalidateAppointmentsCache() {
  cache = null;
  cacheTime = 0;
}
