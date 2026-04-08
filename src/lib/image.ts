/**
 * Image Utilities — Server-only
 *
 * Validation and size-checking for uploaded images.
 * No canvas dependency — runs in Node.js edge runtime.
 */

// ── Constants ───────────────────────────────────────────────

export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_FILE_SIZE_LABEL = "10MB";

// ── Validation ──────────────────────────────────────────────

export interface ImageValidation {
  valid: boolean;
  error?: string;
}

/**
 * Validate an image buffer for the Wiro API.
 * Checks MIME type and size constraints.
 */
export function validateImage(
  size: number,
  mimeType: string
): ImageValidation {
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return {
      valid: false,
      error: `Invalid file type "${mimeType}". Accepted: JPG, PNG, WebP.`,
    };
  }

  if (size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File too large (${(size / 1024 / 1024).toFixed(1)}MB). Maximum: ${MAX_FILE_SIZE_LABEL}.`,
    };
  }

  if (size === 0) {
    return { valid: false, error: "File is empty." };
  }

  return { valid: true };
}

/**
 * Detect basic image dimensions from buffer header bytes.
 * Supports JPEG, PNG. Returns null if unable to determine.
 */
export function getImageDimensions(
  buffer: Buffer
): { width: number; height: number } | null {
  try {
    // PNG: bytes 16-23 contain width (4 bytes) and height (4 bytes)
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    ) {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      return { width, height };
    }

    // JPEG: scan for SOF0 marker (0xFF 0xC0)
    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
      let offset = 2;
      while (offset < buffer.length - 9) {
        if (buffer[offset] === 0xff) {
          const marker = buffer[offset + 1];
          // SOF markers: 0xC0-0xC3
          if (marker >= 0xc0 && marker <= 0xc3) {
            const height = buffer.readUInt16BE(offset + 5);
            const width = buffer.readUInt16BE(offset + 7);
            return { width, height };
          }
          // Skip to next marker
          const segLen = buffer.readUInt16BE(offset + 2);
          offset += segLen + 2;
        } else {
          offset++;
        }
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Ensure image buffer is within limits. Returns the buffer as-is
 * if valid, or throws a descriptive error.
 */
export function ensureImageWithinLimits(
  buffer: Buffer,
  mimeType: string
): Buffer {
  const validation = validateImage(buffer.length, mimeType);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const dims = getImageDimensions(buffer);
  if (dims) {
    console.log("[image] dimensions", { width: dims.width, height: dims.height });
    // Warn on very large images
    if (dims.width > 4096 || dims.height > 4096) {
      console.warn("[image] very large image, may be slow to process");
    }
  }

  return buffer;
}
