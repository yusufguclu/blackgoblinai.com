/**
 * POST /api/generate
 *
 * Receives an image file + style slug via FormData.
 * Processes the image through the generation service (in-memory only).
 * Returns the result as base64-encoded JSON.
 *
 * No files are written to disk — everything is processed in memory.
 * In production, you could add a queue system (e.g., BullMQ) here
 * for long-running AI generation tasks.
 */

import { NextRequest, NextResponse } from "next/server";
import { validateImageBuffer } from "@/lib/validators";
import { generateImage } from "@/services/imageGeneration";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;
    const styleSlug = formData.get("styleSlug") as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image file provided." },
        { status: 400 }
      );
    }

    if (!styleSlug) {
      return NextResponse.json(
        { success: false, error: "No style selected." },
        { status: 400 }
      );
    }

    // Validate the file server-side
    const validation = validateImageBuffer(file.size, file.type);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Convert File to Buffer — processed entirely in memory
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate the image using the service layer
    // The hidden prompt is fetched internally — never exposed to the client
    const result = await generateImage(styleSlug, buffer, file.type);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      imageBase64: result.imageBase64,
    });
  } catch (error) {
    console.error("Generation API error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
