import { forwardAuthRequest } from "@/server/auth-proxy";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface SessionIdRouteContext {
  params: Promise<{ sessionId: string }>;
}

export async function DELETE(
  request: Request,
  context: SessionIdRouteContext,
): Promise<Response> {
  const { sessionId } = await context.params;
  return forwardAuthRequest(request, "DELETE", ["auth", "sessions", sessionId]);
}
