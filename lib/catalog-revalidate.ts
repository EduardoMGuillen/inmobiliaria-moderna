import { revalidatePath } from "next/cache";

/** Invalida páginas públicas/admin tras mutaciones de inmuebles. */
export function revalidatePropertyCatalog(propertyId?: string) {
  revalidatePath("/");
  revalidatePath("/inmuebles");
  revalidatePath("/admin");
  if (propertyId) {
    revalidatePath(`/inmueble/${propertyId}`);
  }
}
