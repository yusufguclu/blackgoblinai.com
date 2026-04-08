/**
 * POST /api/generate/status
 *
 * Poll Wiro task status. Called by the frontend to check progress.
 *
 * Body: { taskId: string }
 * Returns: { success, status, completed, imageUrl?, error?, elapsed? }
 */

import { NextRequest, NextResponse } from "next/server";
import { getTaskDetail, isTerminalStatus } from "@/services/wiro";
import type { ApiStatusResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId } = body;

    if (!taskId || typeof taskId !== "string") {
      return NextResponse.json(
        { success: false, status: "error", completed: false, error: "Missing taskId." },
        { status: 400 }
      );
    }

    console.log("[api/generate/status] poll", { taskId });

    const task = await getTaskDetail(taskId);
    const completed = isTerminalStatus(task.status);

    const response: ApiStatusResponse = {
      success: true,
      status: task.status,
      completed,
      elapsed: task.elapsedseconds ? parseFloat(task.elapsedseconds) : undefined,
    };

    if (completed) {
      if (task.pexit === "0") {
        // Success — extract output image URL
        if (task.outputs?.length) {
          const outputUrl = task.outputs[0].url;
          console.log("[api/generate/status] task completed, output URL:", outputUrl);
          response.imageUrl = outputUrl;
        } else {
          response.success = false;
          response.error = "Task completed but no output images found.";
        }
      } else {
        // Task failed
        response.success = false;
        response.error = task.debugoutput || `Task failed (exit ${task.pexit})`;
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("[api/generate/status] error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to check task status.";
    return NextResponse.json(
      {
        success: false,
        status: "error",
        completed: false,
        error: message,
      } satisfies ApiStatusResponse,
      { status: 500 }
    );
  }
}
