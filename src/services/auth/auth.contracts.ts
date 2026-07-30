export interface MockRequestOptions {
  delayMs?: number;
  scenario?: string;
}

export interface GatewayOperationContext {
  requestReference?: string;
}
