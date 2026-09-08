import { unstable_noStore as noStore } from "next/cache";
import { createVersionedJsonStore } from "@/lib/blob-store";
import type { Property } from "@/lib/types";

const store = createVersionedJsonStore<Property>({
  catalogPrefix: "secaira/properties/catalog/",
  legacyPath: "properties.json",
});

export async function readAllProperties(_forceRefresh = false): Promise<Property[]> {
  noStore();
  return store.readCatalog();
}

export async function writeAllProperties(properties: Property[]) {
  await store.writeCatalog(properties);
}

export type PropertyMutationResult = {
  property?: Property;
  properties: Property[];
};
