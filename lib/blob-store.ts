import { del, list, put } from "@vercel/blob";

/**
 * Cada guardado escribe un pathname NUEVO.
 * Evita la caché CDN ~60s de Vercel Blob al sobrescribir el mismo archivo.
 */

const KEEP_VERSIONS = 6;

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

function sortNewestFirst(
  blobs: Array<{ pathname: string; uploadedAt?: Date | string; url: string }>
) {
  return [...blobs].sort((a, b) => {
    const ta = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0;
    const tb = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0;
    if (tb !== ta) return tb - ta;
    return b.pathname.localeCompare(a.pathname);
  });
}

async function listAllWithPrefix(prefix: string) {
  const blobs: Array<{ pathname: string; uploadedAt?: Date; url: string }> = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix, cursor, limit: 1000 });
    blobs.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return blobs;
}

async function fetchJsonFromUrl<T>(url: string): Promise<T[] | null> {
  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return Array.isArray(data) ? (data as T[]) : null;
}

async function readLegacyJson<T>(legacyPath: string): Promise<T[] | null> {
  try {
    const page = await list({ prefix: legacyPath, limit: 20 });
    const exact = page.blobs.find((b) => b.pathname === legacyPath);
    if (!exact) return null;
    return fetchJsonFromUrl<T>(exact.url);
  } catch {
    return null;
  }
}

async function pruneOldVersions(
  blobs: Array<{ url: string; pathname: string }>
) {
  if (blobs.length <= KEEP_VERSIONS) return;
  const toDelete = blobs.slice(KEEP_VERSIONS).map((b) => b.url);
  if (!toDelete.length) return;
  try {
    await del(toDelete);
  } catch {
    /* best-effort */
  }
}

export function createVersionedJsonStore<T>(opts: {
  catalogPrefix: string;
  legacyPath: string;
}) {
  const { catalogPrefix, legacyPath } = opts;
  let writeChain: Promise<void> = Promise.resolve();
  let memory: T[] | null = null;

  async function readCatalog(): Promise<T[]> {
    const blobs = sortNewestFirst(await listAllWithPrefix(catalogPrefix));

    if (blobs.length > 0) {
      for (const blob of blobs) {
        try {
          const data = await fetchJsonFromUrl<T>(blob.url);
          if (data) {
            memory = data;
            return data;
          }
        } catch {
          /* try older version */
        }
      }
      throw new Error(`No se pudo leer el catálogo versionado (${catalogPrefix})`);
    }

    const legacy = await readLegacyJson<T>(legacyPath);
    if (legacy) {
      memory = legacy;
      return legacy;
    }

    memory = [];
    return [];
  }

  async function writeCatalog(items: T[]) {
    const run = async () => {
      const pathname = `${catalogPrefix}${Date.now()}-${randomId()}.json`;
      await put(pathname, JSON.stringify(items, null, 2), {
        access: "public",
        addRandomSuffix: false,
        contentType: "application/json",
        cacheControlMaxAge: 60,
      });

      memory = items;

      try {
        const blobs = sortNewestFirst(await listAllWithPrefix(catalogPrefix));
        await pruneOldVersions(blobs);
      } catch {
        /* prune non-fatal */
      }
    };

    writeChain = writeChain.then(run, run);
    await writeChain;
  }

  function peekMemory() {
    return memory;
  }

  function clearMemory() {
    memory = null;
  }

  return { readCatalog, writeCatalog, peekMemory, clearMemory };
}
