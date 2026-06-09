import { put, head, list } from "@vercel/blob";
import type { Property } from "@/lib/types";

const BLOB_NAME = "properties.json";

let cache: Property[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 1000;

export async function readAllProperties(forceRefresh = false): Promise<Property[]> {
  if (!forceRefresh && cache && Date.now() - cacheTime < CACHE_TTL) {
    return cache;
  }

  try {
    const blob = await head(BLOB_NAME);
    if (blob?.url) {
      const cacheBuster = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const res = await fetch(`${blob.url}?ts=${cacheBuster}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache, no-store, must-revalidate", Pragma: "no-cache" },
      });
      if (res.ok) {
        const data = await res.json();
        const result = Array.isArray(data) ? (data as Property[]) : [];
        cache = result;
        cacheTime = Date.now();
        return result;
      }
    }
  } catch {
    /* fallback below */
  }

  try {
    const { blobs } = await list();
    const candidates = blobs.filter(
      (b) => b.pathname === BLOB_NAME || b.pathname?.startsWith("properties-")
    );
    if (candidates.length) {
      candidates.sort(
        (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );
      const res = await fetch(`${candidates[0].url}?ts=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const result = Array.isArray(data) ? (data as Property[]) : [];
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

export async function writeAllProperties(properties: Property[]) {
  cache = null;
  cacheTime = 0;

  await put(BLOB_NAME, JSON.stringify(properties, null, 2), {
    contentType: "application/json",
    access: "public",
    addRandomSuffix: false,
    cacheControlMaxAge: 0,
  });

  await new Promise((resolve) => setTimeout(resolve, 100));
  await readAllProperties(true);
}
