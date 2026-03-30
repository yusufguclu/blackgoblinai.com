// ── Style Types ──────────────────────────────────────────────

/** Full style configuration — server-only, contains hidden prompt */
export interface StyleConfig {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  hiddenPrompt: string;
  active: boolean;
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
  mimeType?: string;
  error?: string;
}

// ── Validation Types ─────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// ── API Response Types ───────────────────────────────────────

export interface ApiGenerateResponse {
  success: boolean;
  imageBase64?: string;
  error?: string;
}
