type CaptureKind = "document" | "liveness";

interface ProviderMessage { type?: unknown; sessionId?: unknown; }

export async function openCaptureProvider(kind: CaptureKind, sessionId: string, clientToken?: string): Promise<void> {
  const configured = kind === "document" ? process.env.NEXT_PUBLIC_MUCYORA_DOCUMENT_CAPTURE_ORIGIN : process.env.NEXT_PUBLIC_MUCYORA_LIVENESS_ORIGIN;
  if (!configured) throw new Error(`${kind === "document" ? "Document capture" : "Liveness"} provider is not configured.`);
  const origin = new URL(configured).origin;
  const target = new URL(kind === "document" ? "/capture" : "/liveness", origin);
  const fragment = new URLSearchParams({ sessionId });
  if (clientToken) fragment.set("clientToken", clientToken);
  target.hash = fragment.toString();
  const popup = window.open(target, `mucyora-${kind}-capture`, "popup,width=520,height=760");
  if (!popup) throw new Error("The secure capture window was blocked by the browser.");
  const captureWindow = popup;
  await new Promise<void>((resolve, reject) => {
    const expectedType = kind === "document" ? "MUCYORA_DOCUMENT_CAPTURE_COMPLETED" : "MUCYORA_LIVENESS_COMPLETED";
    const timeout = window.setTimeout(() => finish(new Error("The secure capture session expired.")), 10 * 60 * 1_000);
    const closed = window.setInterval(() => { if (captureWindow.closed) finish(new Error("The secure capture window was closed before completion.")); }, 500);
    const onMessage = (event: MessageEvent<ProviderMessage>) => {
      if (event.origin !== origin || event.source !== captureWindow || event.data?.type !== expectedType || event.data.sessionId !== sessionId) return;
      finish();
    };
    function finish(error?: Error) {
      window.clearTimeout(timeout); window.clearInterval(closed); window.removeEventListener("message", onMessage); if (!captureWindow.closed) captureWindow.close();
      if (error) reject(error); else resolve();
    }
    window.addEventListener("message", onMessage);
  });
}
