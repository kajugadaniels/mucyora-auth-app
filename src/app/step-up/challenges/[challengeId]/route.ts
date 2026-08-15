import { forwardAuthRequest } from "@/server/auth-proxy";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface ChallengeIdRouteContext {
  params: Promise<{ challengeId: string }>;
}

export async function GET(
  request: Request,
  context: ChallengeIdRouteContext,
): Promise<Response> {
  const { challengeId } = await context.params;
  return forwardAuthRequest(request, "GET", ["step-up", "challenges", challengeId]);
}
