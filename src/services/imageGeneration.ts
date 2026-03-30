/**
 * Image Generation Service
 *
 * Abstraction layer for AI image generation. Uses a provider interface
 * so the underlying AI service can be swapped without touching business logic.
 *
 * Currently uses a MockProvider that returns a simple processed version
 * of the uploaded image. Replace with a real provider (e.g., Replicate,
 * Stability AI, OpenAI DALL-E) when ready.
 */

import type { GenerationResult } from "@/types";
import { getStyleBySlug } from "./styles";

// ── Provider Interface ───────────────────────────────────────

export interface ImageGenerationProvider {
  /**
   * Generate a transformed image from the source image using the given prompt.
   * @param imageBuffer - The raw image bytes
   * @param prompt - The hidden prompt/template for this style
   * @param mimeType - MIME type of the source image
   * @returns GenerationResult with base64-encoded output image
   */
  generate(
    imageBuffer: Buffer,
    prompt: string,
    mimeType: string
  ): Promise<GenerationResult>;
}

// ── Mock Provider ────────────────────────────────────────────

/**
 * MockProvider — Returns the uploaded image as-is (base64 encoded).
 * In a real implementation, this would call an external AI API.
 *
 * To replace with a real provider:
 * 1. Create a new class implementing ImageGenerationProvider
 * 2. Call the AI API in the generate() method
 * 3. Swap `activeProvider` below
 *
 * Example with Replicate:
 * ```
 * class ReplicateProvider implements ImageGenerationProvider {
 *   async generate(imageBuffer: Buffer, prompt: string, mimeType: string) {
 *     const prediction = await replicate.run("model-id", {
 *       input: { image: imageBuffer.toString("base64"), prompt }
 *     });
 *     return { success: true, imageBase64: prediction.output, mimeType: "image/png" };
 *   }
 * }
 * ```
 */
class MockProvider implements ImageGenerationProvider {
  async generate(
    imageBuffer: Buffer,
    _prompt: string,
    mimeType: string
  ): Promise<GenerationResult> {
    // Simulate processing delay (1-2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In mock mode, return the original image as base64.
    // A real provider would return the AI-transformed image.
    const imageBase64 = imageBuffer.toString("base64");

    return {
      success: true,
      imageBase64,
      mimeType,
    };
  }
}

// ── Active Provider ──────────────────────────────────────────
// Swap this to use a real AI provider:
// const activeProvider: ImageGenerationProvider = new ReplicateProvider();
const activeProvider: ImageGenerationProvider = new MockProvider();

// ── Public API ───────────────────────────────────────────────

/**
 * Generate a transformed image for the given style.
 * Fetches the hidden prompt from the style config and passes it to the provider.
 * All processing is done in memory — no files are written to disk.
 */
export async function generateImage(
  styleSlug: string,
  imageBuffer: Buffer,
  mimeType: string
): Promise<GenerationResult> {
  const style = getStyleBySlug(styleSlug);

  if (!style) {
    return {
      success: false,
      error: `Style "${styleSlug}" not found or is inactive.`,
    };
  }

  try {
    // The hidden prompt is fetched server-side and never sent to the client
    const result = await activeProvider.generate(
      imageBuffer,
      style.hiddenPrompt,
      mimeType
    );
    return result;
  } catch (error) {
    console.error("Image generation failed:", error);
    return {
      success: false,
      error: "Image generation failed. Please try again.",
    };
  }
}
