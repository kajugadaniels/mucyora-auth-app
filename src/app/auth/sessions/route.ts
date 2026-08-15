import { forwardAuthRequest } from "@/server/auth-proxy";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function GET(request: Request): Promise<Response> {
  return forwardAuthRequest(request, "GET", ["auth", "sessions"]);
}
