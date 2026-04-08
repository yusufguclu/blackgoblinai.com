// ── Style Types ──────────────────────────────────────────────

/** Full style configuration — server-only, contains hidden prompt */
export interface StyleConfig {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  hiddenPrompt: string;
  active: boolean;
  /**
   * Optional: URL of a reference image to send alongside the user's image.
   * When set, Wiro receives TWO images: [referenceImageUrl, userImage]
   * Used for face-swap / two-image modes.
   * SERVER-ONLY — never exposed to the client.
   */
  referenceImageUrl?: string;
}

/** Client-safe style info — hiddenPrompt stripped */
export interface PublicStyleInfo {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
}

// ── Generation Types ─────────────────────────────────────────

export interface GenerationRequest {
  styleSlug: string;
  imageBuffer: Buffer;
  mimeType: string;
}

export interface GenerationResult {
  success: boolean;
  imageBase64?: string;
  imageUrl?: string;
  mimeType?: string;
  error?: string;
}

// ── Validation Types ─────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// ── Generation Mode ──────────────────────────────────────────

export type GenerationMode = "text-to-image" | "image-to-image";

// ── API Response Types ───────────────────────────────────────

export interface ApiGenerateResponse {
  success: boolean;
  taskId?: string;
  imageBase64?: string;
  imageUrl?: string;
  error?: string;
}

export interface ApiStatusResponse {
  success: boolean;
  status: string;
  completed: boolean;
  imageUrl?: string;
  imageBase64?: string;
  error?: string;
  elapsed?: number;
}

// ── Wiro API Types ───────────────────────────────────────────

export interface WiroRunResponse {
  result: boolean;
  errors: string[];
  taskid: string;
  socketaccesstoken: string;
}

export interface WiroTaskOutput {
  name: string;
  contenttype: string;
  size: string;
  url: string;
}

export interface WiroTaskDetail {
  id: string;
  socketaccesstoken: string;
  parameters: Record<string, string>;
  status: string;
  pexit: string;
  debugoutput: string;
  starttime: string;
  endtime: string;
  elapsedseconds: string;
  totalcost: string;
  outputs: WiroTaskOutput[];
}
