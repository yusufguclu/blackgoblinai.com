/**
 * POST /api/generate
 *
 * Two modes:
 *   1. Image-to-image: FormData with `image` file + `styleSlug`
 *   2. Text-to-image:  FormData with `prompt` + optional `aspectRatio`, `resolution`
 *
 * Credit system:
 *   - Checks user has >= 1 credit before generating
 *   - Deducts 1 credit when generation task starts successfully
 *
 * Returns { success, taskId } for async polling, OR { success, imageUrl } if waited.
 * The `mode` field in the request determines the flow ("sync" waits, default is "async").
 */

import { NextRequest, NextResponse } from "next/server";
import { validateImage } from "@/lib/image";
import { getStyleBySlug } from "@/services/styles";
import { createClient } from "@/lib/supabase/server";
import { deductCredit } from "@/lib/credits";
import {
  runImageToImage,
  runTextToImage,
  pollTask,
} from "@/services/wiro";

export async function POST(request: NextRequest) {
  const reqStart = Date.now();

  try {
    // ── Auth & Credit Check ─────────────────────────────────────
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "You must be logged in to generate images." },
        { status: 401 }
      );
    }

    // Check credits
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      console.error("[api/generate] profile fetch error:", profileError);
      return NextResponse.json(
        { success: false, error: "Could not verify credits. Please try again." },
        { status: 500 }
      );
    }

    if (profile.credits <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No credits remaining. Please purchase more credits to continue.",
          code: "NO_CREDITS",
        },
        { status: 403 }
      );
    }

    // ── Parse FormData ──────────────────────────────────────────
    const formData = await request.formData();

    const file = formData.get("image") as File | null;
    const styleSlug = formData.get("styleSlug") as string | null;
    const prompt = formData.get("prompt") as string | null;
    const aspectRatio = (formData.get("aspectRatio") as string) || "1:1";
    const resolution = (formData.get("resolution") as string) || "1024x1024";
    const waitMode = (formData.get("mode") as string) || "async";

    const isImageToImage = !!file && !!styleSlug;
    const isTextToImage = !!prompt && !file;

    if (!isImageToImage && !isTextToImage) {
      return NextResponse.json(
        {
          success: false,
          error: "Provide either (image + styleSlug) for image-to-image, or (prompt) for text-to-image.",
        },
        { status: 400 }
      );
    }

    // ── Image-to-image flow ───────────────────────────────────
    if (isImageToImage) {
      // Validate image
      const validation = validateImage(file.size, file.type);
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, error: validation.error },
          { status: 400 }
        );
      }

      // Resolve hidden prompt from style config
      const style = getStyleBySlug(styleSlug);
      if (!style) {
        return NextResponse.json(
          { success: false, error: `Style "${styleSlug}" not found.` },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      console.log("[api/generate] image-to-image:start", {
        styleSlug,
        size: buffer.length,
        type: file.type,
        waitMode,
        creditsRemaining: profile.credits,
      });

      // Start the model run
      const run = await runImageToImage(buffer, style.hiddenPrompt, file.type, style.referenceImageUrl ?? undefined);

      // ── Deduct 1 credit after successful task start ──────────
      const deducted = await deductCredit(user.id);
      if (!deducted) {
        console.warn("[api/generate] credit deduction failed after task start", { userId: user.id });
      }

      // Async mode: return taskId for client-side polling
      if (waitMode === "async") {
        console.log("[api/generate] image-to-image:taskId", { taskId: run.taskid, ms: Date.now() - reqStart });
        return NextResponse.json({
          success: true,
          taskId: run.taskid,
          creditsRemaining: profile.credits - 1,
        });
      }

      // Sync mode: wait for completion (blocking)
      const task = await pollTask(run.taskid);
      if (!task.outputs?.length) {
        return NextResponse.json(
          { success: false, error: "No output images returned." },
          { status: 500 }
        );
      }

      console.log("[api/generate] image-to-image:success", { ms: Date.now() - reqStart });
      return NextResponse.json({
        success: true,
        imageUrl: task.outputs[0].url,
        creditsRemaining: profile.credits - 1,
      });
    }

    // ── Text-to-image flow ────────────────────────────────────
    console.log("[api/generate] text-to-image:start", {
      promptLen: prompt!.length,
      aspectRatio,
      resolution,
      waitMode,
      creditsRemaining: profile.credits,
    });

    const run = await runTextToImage(prompt!, aspectRatio, resolution);

    // ── Deduct 1 credit after successful task start ──────────
    const deducted = await deductCredit(user.id);
    if (!deducted) {
      console.warn("[api/generate] credit deduction failed after task start", { userId: user.id });
    }

    // Async mode
    if (waitMode === "async") {
      console.log("[api/generate] text-to-image:taskId", { taskId: run.taskid, ms: Date.now() - reqStart });
      return NextResponse.json({
        success: true,
        taskId: run.taskid,
        creditsRemaining: profile.credits - 1,
      });
    }

    // Sync mode
    const task = await pollTask(run.taskid);
    if (!task.outputs?.length) {
      return NextResponse.json(
        { success: false, error: "No output images returned." },
        { status: 500 }
      );
    }

    console.log("[api/generate] text-to-image:success", { ms: Date.now() - reqStart });
    return NextResponse.json({
      success: true,
      imageUrl: task.outputs[0].url,
      creditsRemaining: profile.credits - 1,
    });
  } catch (error) {
    console.error("[api/generate] error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
