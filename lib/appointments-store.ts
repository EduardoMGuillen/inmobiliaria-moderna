import { unstable_noStore as noStore } from "next/cache";
import { createVersionedJsonStore } from "@/lib/blob-store";
import type { Appointment } from "@/lib/types";

const store = createVersionedJsonStore<Appointment>({
  catalogPrefix: "secaira/appointments/catalog/",
  legacyPath: "appointments.json",
});

export async function readAllAppointments(): Promise<Appointment[]> {
  noStore();
  return store.readCatalog();
}

export async function writeAllAppointments(appointments: Appointment[]) {
  await store.writeCatalog(appointments);
}

export function invalidateAppointmentsCache() {
  store.clearMemory();
}
