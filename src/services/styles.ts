/**
 * Style Configuration — SERVER-ONLY
 *
 * This file contains the predefined styles with their hidden prompts.
 * The hiddenPrompt field must NEVER be exposed to the client.
 * Use getPublicStyles() or getPublicStyleBySlug() for client-safe data.
 */

import type { StyleConfig, PublicStyleInfo } from "@/types";

const styles: StyleConfig[] = [
  {
    id: "style_001",
    slug: "anime-character",
    name: "Anime Character",
    shortDescription:
      "Transform your photo into a stunning anime-style character portrait with vibrant colors and expressive features.",
    hiddenPrompt:
      "Transform this photograph into a high-quality anime character portrait. " +
      "Use the classic Japanese anime art style with large expressive eyes, " +
      "clean line art, vibrant hair colors, and soft cel-shading. " +
      "Maintain the person's key facial features and expression while applying " +
      "the anime aesthetic. Background should be a soft gradient. " +
      "Output should be a polished, professional anime illustration.",
    active: true,
  },
  // Future styles can be added here:
  // {
  //   id: "style_002",
  //   slug: "oil-painting",
  //   name: "Oil Painting",
  //   shortDescription: "...",
  //   hiddenPrompt: "...",
  //   active: false,
  // },
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

/** Get full style config by slug — SERVER ONLY, never call from client */
export function getStyleBySlug(slug: string): StyleConfig | null {
  return styles.find((s) => s.slug === slug && s.active) ?? null;
}
