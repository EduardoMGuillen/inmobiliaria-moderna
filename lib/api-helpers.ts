import { NextResponse } from "next/server";
import { ADMIN_PASSWORD } from "@/lib/brand";

export function jsonResponse(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0, private",
      Pragma: "no-cache",
      Expires: "0",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-admin-token",
  };
}

export function isAuthorized(request: Request) {
  return request.headers.get("x-admin-token") === ADMIN_PASSWORD;
}

export function handleOptions() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}
