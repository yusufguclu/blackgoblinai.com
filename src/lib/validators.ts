import type { ValidationResult } from "@/types";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_FILE_SIZE_LABEL = "5MB";

/**
 * Validate an uploaded image file (client-side usage).
 */
export function validateImageFile(file: File): ValidationResult {
  if (!file) {
    return { valid: false, error: "No file selected." };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Please upload a JPG, JPEG, or PNG image.",
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File is too large. Maximum size is ${MAX_FILE_SIZE_LABEL}.`,
    };
  }

  return { valid: true };
}

/**
 * Validate image buffer on the server side.
 */
export function validateImageBuffer(
  size: number,
  mimeType: string
): ValidationResult {
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return {
      valid: false,
      error: "Invalid file type. Only JPG, JPEG, and PNG are accepted.",
    };
  }

  if (size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File is too large. Maximum size is ${MAX_FILE_SIZE_LABEL}.`,
    };
  }

  return { valid: true };
}
