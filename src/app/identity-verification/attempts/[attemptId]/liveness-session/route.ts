import { forwardAuthRequest } from "@/server/auth-proxy";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface AttemptIdRouteContext {
  params: Promise<{ attemptId: string }>;
}

export async function POST(
  request: Request,
  context: AttemptIdRouteContext,
): Promise<Response> {
  const { attemptId } = await context.params;
  return forwardAuthRequest(request, "POST", ["identity-verification", "attempts", attemptId, "liveness-session"]);
}
