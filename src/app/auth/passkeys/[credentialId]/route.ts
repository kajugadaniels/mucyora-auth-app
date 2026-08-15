import { forwardAuthRequest } from "@/server/auth-proxy";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface CredentialIdRouteContext {
  params: Promise<{ credentialId: string }>;
}

export async function DELETE(
  request: Request,
  context: CredentialIdRouteContext,
): Promise<Response> {
  const { credentialId } = await context.params;
  return forwardAuthRequest(request, "DELETE", ["auth", "passkeys", credentialId]);
}
