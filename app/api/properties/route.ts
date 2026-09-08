import { handleOptions, isAuthorized, jsonResponse } from "@/lib/api-helpers";
import { revalidatePropertyCatalog } from "@/lib/catalog-revalidate";
import { MAX_FEATURED } from "@/lib/constants";
import { readAllProperties, writeAllProperties } from "@/lib/properties-store";
import type { Property } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("id");

  if (propertyId) {
    const properties = await readAllProperties(true);
    const property = properties.find((p) => String(p.id) === String(propertyId));
    if (!property) return jsonResponse({ error: "Property not found" }, 404);
    if (property.hidden && !isAuthorized(request)) {
      return jsonResponse({ error: "Property not found" }, 404);
    }
    return jsonResponse(property);
  }

  const includeAll = searchParams.get("all") === "1" && isAuthorized(request);
  const featuredOnly = searchParams.get("featured") === "1";
  const properties = await readAllProperties(true);
  let list = includeAll ? properties : properties.filter((p) => !p.hidden);

  if (featuredOnly) {
    list = list.filter((p) => p.featured);
  }

  return jsonResponse(list);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) return jsonResponse({ error: "Unauthorized" }, 401);

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  const {
    id,
    title,
    price,
    category,
    status,
    department,
    municipio,
    details,
    amenities,
    image,
    images,
    whatsappText,
    hidden,
    featured,
  } = payload;

  const properties = await readAllProperties(true);
  const existingIdx =
    id != null ? properties.findIndex((p) => String(p.id) === String(id)) : -1;

  if (existingIdx >= 0) {
    const current = properties[existingIdx];

    if (featured === true && !current.featured) {
      const featuredCount = properties.filter((p) => p.featured && !p.hidden).length;
      if (featuredCount >= MAX_FEATURED) {
        return jsonResponse(
          {
            error: `Ya hay ${MAX_FEATURED} inmuebles destacados. Desmarca uno antes de destacar otro.`,
          },
          400
        );
      }
    }

    const updated: Property = {
      ...current,
      ...(title !== undefined ? { title: String(title) } : {}),
      ...(price !== undefined ? { price: String(price) } : {}),
      ...(category !== undefined ? { category: category as Property["category"] } : {}),
      ...(status !== undefined ? { status: status as Property["status"] } : {}),
      ...(department !== undefined ? { department: String(department) } : {}),
      ...(municipio !== undefined ? { municipio: String(municipio) } : {}),
      ...(details !== undefined
        ? { details: Array.isArray(details) ? (details as string[]) : [] }
        : {}),
      ...(amenities !== undefined
        ? { amenities: Array.isArray(amenities) ? (amenities as string[]) : [] }
        : {}),
      ...(image !== undefined ? { image: String(image) } : {}),
      ...(images !== undefined
        ? {
            images:
              Array.isArray(images) && images.length
                ? (images as string[])
                : image
                  ? [String(image)]
                  : current.images,
          }
        : {}),
      ...(whatsappText !== undefined ? { whatsappText: String(whatsappText) } : {}),
      ...(hidden !== undefined ? { hidden: Boolean(hidden) } : {}),
      ...(featured !== undefined ? { featured: Boolean(featured) } : {}),
    };

    const next = [...properties];
    next[existingIdx] = updated;
    await writeAllProperties(next);
    revalidatePropertyCatalog(updated.id);
    return jsonResponse({ property: updated, properties: next });
  }

  if (!title || !price || !category || !status || !image || !department || !municipio) {
    return jsonResponse({ error: "Missing required fields" }, 400);
  }

  const newItem: Property = {
    id: (id as string) || `${Date.now()}`,
    title: String(title),
    price: String(price),
    category: category as Property["category"],
    status: status as Property["status"],
    department: String(department),
    municipio: String(municipio),
    details: Array.isArray(details) ? (details as string[]) : [],
    amenities: Array.isArray(amenities) ? (amenities as string[]) : [],
    image: String(image),
    images: Array.isArray(images) && images.length ? (images as string[]) : [String(image)],
    whatsappText: whatsappText ? String(whatsappText) : "",
    hidden: Boolean(hidden),
    featured: Boolean(featured || false),
  };

  const next = [...properties, newItem];
  await writeAllProperties(next);
  revalidatePropertyCatalog(newItem.id);
  return jsonResponse({ property: newItem, properties: next });
}

export async function DELETE(request: Request) {
  if (!isAuthorized(request)) return jsonResponse({ error: "Unauthorized" }, 401);

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const soft = searchParams.get("soft");

  if (!id) return jsonResponse({ error: "Missing id" }, 400);

  const properties = await readAllProperties(true);

  if (soft === "1") {
    const idx = properties.findIndex((p) => String(p.id) === String(id));
    if (idx >= 0) {
      const next = [...properties];
      next[idx] = { ...next[idx], hidden: true };
      await writeAllProperties(next);
      revalidatePropertyCatalog(id);
      return jsonResponse({ ok: true, hidden: true, properties: next });
    }
    return jsonResponse({ ok: true, hidden: true, properties });
  }

  const next = properties.filter((p) => String(p.id) !== String(id));
  await writeAllProperties(next);
  revalidatePropertyCatalog(id);
  return jsonResponse({ ok: true, deleted: true, properties: next });
}
