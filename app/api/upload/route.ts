import { put } from "@vercel/blob";
import { handleOptions, isAuthorized, jsonResponse } from "@/lib/api-helpers";

export async function OPTIONS() {
  return handleOptions();
}

export async function GET() {
  return jsonResponse({ ok: true });
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) return jsonResponse({ error: "Unauthorized" }, 401);

  let payload: { name?: string; dataBase64?: string };
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  const { name, dataBase64 } = payload;
  if (!name || !dataBase64) {
    return jsonResponse({ error: "Missing name or dataBase64" }, 400);
  }

  const match = dataBase64.match(/^data:(.*?);base64,(.*)$/);
  if (!match) return jsonResponse({ error: "Invalid data URL" }, 400);

  const contentType = match[1] || "application/octet-stream";
  const buffer = Buffer.from(match[2], "base64");
  const safeName = name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `uploads/${Date.now()}_${safeName}`;

  const { url } = await put(key, buffer, { contentType, access: "public" });
  return jsonResponse({ url, key });
}
