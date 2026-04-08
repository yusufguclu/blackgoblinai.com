/**
 * Style Configuration — SERVER-ONLY
 *
 * Predefined styles with hidden prompts.
 * hiddenPrompt must NEVER be exposed to the client.
 * Use getPublicStyles() or getPublicStyleBySlug() for client-safe data.
 */

import type { StyleConfig, PublicStyleInfo } from "@/types";

const styles: StyleConfig[] = [
  {
    id: "style_001",
    slug: "bust-down",
    name: "Bust Down Filter",
    shortDescription:
      "Deep fry your selfies until they become unrecognizable digital pulp. 100% AI processed.",
    hiddenPrompt:
      "Replace the face of the person in the second image with the face from the first image. " +
      "Keep the same pose, lighting, skin tone, facial expression, and overall realism. " +
      "The new face should look natural and fully blended with the second image, " +
      "with no distortion or artifacts.",
    // ─────────────────────────────────────────────────────────────────────────
    // 🔴 BURAYA referans yüz görselinin URL'sini girin.
    // Bu görsel kullanıcının görseli ile birlikte Wiro'ya gönderilecek.
    // Örnek: "https://cdn1.wiro.ai/.../referans-yuz.jpg"
    // ─────────────────────────────────────────────────────────────────────────
    referenceImageUrl: "ref.png ",
    active: true,
  },
  {
    id: "style_002",
    slug: "gigachad",
    name: "Gigachad Meme Maker",
    shortDescription:
      "Automatically insert your face onto the ultimate peak performance physique. No gym required.",
    hiddenPrompt:
      "Transform this portrait into an ultra-masculine, hyper-stylized gigachad meme style. " +
      "Apply dramatic shadow lighting, extreme jawline enhancement, chiseled features, " +
      "black and white high contrast with cinematic composition. " +
      "Make the subject look like the classic gigachad meme with strong facial structure " +
      "and powerful presence. Maintain the person's core identity but amplify all masculine features.",
    active: true,
  },
  {
    id: "style_003",
    slug: "face-swap",
    name: "JD Vance Face Swap",
    shortDescription:
      "Swap faces with political figures for maximum engagement and community guidelines violations.",
    hiddenPrompt:
      "Create a surreal digital face manipulation art piece from this photo. " +
      "Apply kaleidoscopic patterns, vibrant experimental colors, " +
      "psychedelic distortions while keeping the face somewhat recognizable. " +
      "Add abstract geometric overlays and mirror effects. " +
      "Make it look like avant-garde digital art with a surreal, dreamlike quality.",
    active: true,
  },
  {
    id: "style_004",
    slug: "anime-character",
    name: "Anime Character",
    shortDescription:
      "Transform your photo into a stunning anime-style character portrait.",
    hiddenPrompt:
      "Transform this photograph into a high-quality anime character portrait. " +
      "Use the classic Japanese anime art style with large expressive eyes, " +
      "clean line art, vibrant hair colors, and soft cel-shading. " +
      "Maintain the person's key facial features and expression while applying " +
      "the anime aesthetic. Background should be a soft gradient. " +
      "Output should be a polished, professional anime illustration.",
    active: true,
  },
];

/** Strip hiddenPrompt from a style config */
function toPublic(style: StyleConfig): PublicStyleInfo {
  return {
    id: style.id,
    slug: style.slug,
    name: style.name,
    shortDescription: style.shortDescription,
  };
}

/** Get all active styles (client-safe, no hidden prompts) */
export function getPublicStyles(): PublicStyleInfo[] {
  return styles.filter((s) => s.active).map(toPublic);
}

/** Get a single public style by slug */
export function getPublicStyleBySlug(slug: string): PublicStyleInfo | null {
  const style = styles.find((s) => s.slug === slug && s.active);
  return style ? toPublic(style) : null;
}

/** Get full style config by slug — SERVER ONLY */
export function getStyleBySlug(slug: string): StyleConfig | null {
  return styles.find((s) => s.slug === slug && s.active) ?? null;
}
