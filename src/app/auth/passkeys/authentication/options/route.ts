import { forwardAuthRequest } from "@/server/auth-proxy";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function POST(request: Request): Promise<Response> {
  return forwardAuthRequest(request, "POST", ["auth", "passkeys", "authentication", "options"]);
}
