/**
 * Wiro AI Service — Server-only
 *
 * Handles all communication with the Wiro API for image generation.
 * Uses google/nano-banana-pro model with hardcoded parameter mapping.
 *
 * Schema (confirmed via getModelSchema):
 *   - prompt: string (text prompt for generation)
 *   - aspectRatio: string (e.g. "1:1", "16:9")
 *   - resolution: string (e.g. "1024x1024")
 *   - inputImage: file (image-to-image input)
 *   - inputImageUrl: string (alternative URL for image input)
 *
 * Auth: x-api-key header (server-side only)
 * Flow: Run model → receive taskId → poll Task/Detail → read outputs[0].url
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";
import type { WiroRunResponse, WiroTaskDetail } from "@/types";

// ── Config ──────────────────────────────────────────────────

const WIRO_BASE = "https://api.wiro.ai/v1";

function getModel(): string {
  return process.env.WIRO_MODEL || "google/nano-banana-pro";
}

const POLL_INTERVAL_MS = 3_000;
const POLL_TIMEOUT_MS = 180_000; // 3 minutes — slow model

const TERMINAL_STATUSES = new Set([
  "task_postprocess_end",
  "task_error_end",
  "task_cancel",
]);

/** Check if a task status is terminal (done or failed) */
export function isTerminalStatus(status: string): boolean {
  return TERMINAL_STATUSES.has(status);
}

function getAuthHeaders(): Record<string, string> {
  const apiKey = process.env.WIRO_API_KEY;
  if (!apiKey) throw new Error("[Wiro] WIRO_API_KEY is not set");

  const headers: Record<string, string> = {
    "x-api-key": apiKey,
  };

  const apiSecret = process.env.WIRO_API_SECRET;
  if (apiSecret) {
    const nonce = Date.now().toString();
    const signature = crypto
      .createHmac("sha256", apiKey)
      .update(apiSecret + nonce)
      .digest("hex");
    headers["x-signature"] = signature;
    headers["x-nonce"] = nonce;
  }

  return headers;
}

function ts(): string {
  return new Date().toISOString();
}

// ── Run Model (image-to-image) ──────────────────────────────

export async function runImageToImage(
  imageBuffer: Buffer,
  prompt: string,
  mimeType: string,
  referenceImageUrl?: string
): Promise<WiroRunResponse> {
  const start = Date.now();
  const model = getModel();
  const mode = referenceImageUrl ? "dual-image" : "single-image";
  console.log(`[Wiro][${ts()}] run:image-to-image:start`, { model, mimeType, size: imageBuffer.length, mode });

  const ext = mimeType.split("/")[1] || "jpg";
  const userBlob = new Blob([new Uint8Array(imageBuffer)], { type: mimeType });

  const form = new FormData();
  form.append("prompt", prompt);
  form.append("aspectRatio", "1:1");
  form.append("resolution", "1K");
  form.append("safetySetting", "OFF");

  if (referenceImageUrl) {
    // ── Dual-image mode ─────────────────────────────────────
    // Load reference image: local file (src/services/) or remote URL
    let refBuffer: Buffer;
    let refContentType = "image/png";

    const isLocalFile = !referenceImageUrl.startsWith("http");
    if (isLocalFile) {
      // Local file — read from src/services/ directory next to this file
      const filePath = path.join(process.cwd(), "src", "services", referenceImageUrl.trim());
      console.log(`[Wiro][${ts()}] run:read-reference-file`, { filePath });
      refBuffer = fs.readFileSync(filePath);
      const ext2 = referenceImageUrl.trim().split(".").pop() || "png";
      refContentType = ext2 === "jpg" || ext2 === "jpeg" ? "image/jpeg" : "image/png";
    } else {
      // Remote URL — fetch server-side
      console.log(`[Wiro][${ts()}] run:fetch-reference`, { referenceImageUrl });
      const refRes = await fetch(referenceImageUrl, { headers: { Accept: "image/*" } });
      if (!refRes.ok) {
        throw new Error(`Failed to fetch reference image (${refRes.status}): ${referenceImageUrl}`);
      }
      refContentType = refRes.headers.get("content-type") || "image/png";
      refBuffer = Buffer.from(await refRes.arrayBuffer());
    }

    const refExt = refContentType.split("/")[1] || "png";
    const refBlob = new Blob([new Uint8Array(refBuffer)], { type: refContentType });

    // Wiro: [userImage (face source), referenceImage (target body)] — order matters!
    // User's face will be placed onto the reference body.
    form.append("inputImage", userBlob, `user.${ext}`);
    form.append("inputImage", refBlob, `reference.${refExt}`);
    console.log(`[Wiro][${ts()}] run:dual-image-mode`, {
      refContentType,
      refSize: refBlob.size,
      userSize: userBlob.size,
    });
  } else {
    // ── Single-image mode ────────────────────────────────────
    form.append("inputImage", userBlob, `input.${ext}`);
    form.append("inputImageUrl", "");
  }

  const res = await fetch(`${WIRO_BASE}/Run/${model}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: form,
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`[Wiro][${ts()}] run:fail`, { status: res.status, body });
    throw new Error(`Wiro run failed (${res.status}): ${body}`);
  }

  const data: WiroRunResponse = await res.json();

  if (!data.result) {
    console.error(`[Wiro][${ts()}] run:error`, { errors: data.errors });
    throw new Error(`Wiro run error: ${data.errors?.join(", ") || "unknown"}`);
  }

  console.log(`[Wiro][${ts()}] run:image-to-image:ok`, { taskId: data.taskid, ms: Date.now() - start });
  return data;
}


// ── Run Model (text-to-image) ───────────────────────────────

export async function runTextToImage(
  prompt: string,
  aspectRatio = "1:1",
  resolution = "1024x1024"
): Promise<WiroRunResponse> {
  const start = Date.now();
  const model = getModel();
  console.log(`[Wiro][${ts()}] run:text-to-image:start`, { model, prompt: prompt.slice(0, 80) });

  const res = await fetch(`${WIRO_BASE}/Run/${model}`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt, aspectRatio, resolution }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`[Wiro][${ts()}] run:fail`, { status: res.status, body });
    throw new Error(`Wiro run failed (${res.status}): ${body}`);
  }

  const data: WiroRunResponse = await res.json();

  if (!data.result) {
    console.error(`[Wiro][${ts()}] run:error`, { errors: data.errors });
    throw new Error(`Wiro run error: ${data.errors?.join(", ") || "unknown"}`);
  }

  console.log(`[Wiro][${ts()}] run:text-to-image:ok`, { taskId: data.taskid, ms: Date.now() - start });
  return data;
}

// ── Poll Task ───────────────────────────────────────────────

export async function pollTask(taskId: string): Promise<WiroTaskDetail> {
  const start = Date.now();
  console.log(`[Wiro][${ts()}] poll:start`, { taskId });

  while (Date.now() - start < POLL_TIMEOUT_MS) {
    const task = await getTaskDetail(taskId);
    const elapsed = Date.now() - start;
    console.log(`[Wiro][${ts()}] poll:status`, { taskId, status: task.status, elapsed });

    if (isTerminalStatus(task.status)) {
      if (task.pexit !== "0") {
        console.error(`[Wiro][${ts()}] poll:failed`, { taskId, pexit: task.pexit, debug: task.debugoutput });
        throw new Error(
          `Wiro task failed (exit ${task.pexit}): ${task.debugoutput || "no details"}`
        );
      }

      console.log(`[Wiro][${ts()}] poll:success`, {
        taskId,
        elapsed: task.elapsedseconds + "s",
        cost: "$" + task.totalcost,
        outputs: task.outputs?.length ?? 0,
      });
      return task;
    }

    await sleep(POLL_INTERVAL_MS);
  }

  console.error(`[Wiro][${ts()}] poll:timeout`, { taskId, timeoutMs: POLL_TIMEOUT_MS });
  throw new Error(`Wiro task ${taskId} timed out after ${POLL_TIMEOUT_MS / 1000}s`);
}

// ── Task Detail ─────────────────────────────────────────────

export async function getTaskDetail(taskId: string): Promise<WiroTaskDetail> {
  const res = await fetch(`${WIRO_BASE}/Task/Detail`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ taskid: taskId }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Task/Detail failed (${res.status}): ${body}`);
  }

  const data = await res.json();

  if (!data.result || !data.tasklist?.length) {
    throw new Error("Task/Detail returned empty result");
  }

  return data.tasklist[0] as WiroTaskDetail;
}

// ── Helpers ─────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
