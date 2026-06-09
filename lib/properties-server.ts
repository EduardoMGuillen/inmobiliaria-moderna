import { readAllProperties } from "@/lib/properties-store";
import type { Property } from "@/lib/types";

export async function getPublicProperties(): Promise<Property[]> {
  const properties = await readAllProperties();
  return properties.filter((p) => !p.hidden);
}

export async function getPublicPropertyById(id: string): Promise<Property | null> {
  const properties = await readAllProperties();
  const property = properties.find((p) => String(p.id) === String(id));
  if (!property || property.hidden) return null;
  return property;
}
