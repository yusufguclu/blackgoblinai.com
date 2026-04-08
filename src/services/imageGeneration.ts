/**
 * Image Generation Service
 *
 * Provider-based abstraction for AI image generation.
 *
 * Providers:
 *   WiroProvider  — Wiro AI (google/nano-banana-pro), image-to-image
 *   MockProvider  — Returns original image as-is (dev/fallback)
 *
 * Set IMAGE_PROVIDER=mock in .env.local to use MockProvider.
 */

import type { GenerationResult } from "@/types";
import { getStyleBySlug } from "./styles";
import { runImageToImage, runTextToImage, pollTask } from "./wiro";

// ── Provider Interface ───────────────────────────────────────

export interface ImageGenerationProvider {
  generate(
    imageBuffer: Buffer,
    prompt: string,
    mimeType: string
  ): Promise<GenerationResult>;
}

// ── Wiro Provider ────────────────────────────────────────────

class WiroProvider implements ImageGenerationProvider {
  async generate(
    imageBuffer: Buffer,
    prompt: string,
    mimeType: string
  ): Promise<GenerationResult> {
    try {
      // 1. Start model run (image-to-image)
      const run = await runImageToImage(imageBuffer, prompt, mimeType);

      // 2. Poll until done
      const task = await pollTask(run.taskid);

      // 3. Extract output
      if (!task.outputs?.length) {
        return { success: false, error: "No output images returned." };
      }

      return {
        success: true,
        imageUrl: task.outputs[0].url,
        mimeType: task.outputs[0].contenttype || "image/png",
      };
    } catch (err) {
      console.error("[WiroProvider] generation failed:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Image generation failed.",
      };
    }
  }
}

// ── Mock Provider ────────────────────────────────────────────

class MockProvider implements ImageGenerationProvider {
  async generate(
    imageBuffer: Buffer,
    _prompt: string,
    mimeType: string
  ): Promise<GenerationResult> {
    await new Promise((r) => setTimeout(r, 1500));
    return {
      success: true,
      imageBase64: imageBuffer.toString("base64"),
      mimeType,
    };
  }
}

// ── Active Provider ──────────────────────────────────────────

const activeProvider: ImageGenerationProvider =
  process.env.IMAGE_PROVIDER === "mock"
    ? new MockProvider()
    : new WiroProvider();

// ── Public API: Image-to-Image ───────────────────────────────

export async function generateImage(
  styleSlug: string,
  imageBuffer: Buffer,
  mimeType: string
): Promise<GenerationResult> {
  const style = getStyleBySlug(styleSlug);

  if (!style) {
    return { success: false, error: `Style "${styleSlug}" not found.` };
  }

  try {
    return await activeProvider.generate(imageBuffer, style.hiddenPrompt, mimeType);
  } catch (err) {
    console.error("[generateImage] failed:", err);
    return { success: false, error: "Image generation failed. Please try again." };
  }
}

// ── Public API: Text-to-Image ────────────────────────────────

export async function generateTextToImage(
  prompt: string,
  aspectRatio = "1:1",
  resolution = "1024x1024"
): Promise<GenerationResult> {
  try {
    const run = await runTextToImage(prompt, aspectRatio, resolution);
    const task = await pollTask(run.taskid);

    if (!task.outputs?.length) {
      return { success: false, error: "No output images returned." };
    }

    return {
      success: true,
      imageUrl: task.outputs[0].url,
      mimeType: task.outputs[0].contenttype || "image/png",
    };
  } catch (err) {
    console.error("[generateTextToImage] failed:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Text-to-image generation failed.",
    };
  }
}
