# StyleForge.ai — AI Image Transformation MVP

A minimal, polished web app where users select a predefined style, upload a photo, and receive an AI-generated transformed image.

## How It Works

1. **User visits** the landing page and clicks "Create Anime Portrait"
2. **Upload page** shows the selected style card and an image upload zone
3. **User uploads** a JPG/PNG photo (max 5MB) — client-side validation runs immediately
4. **On "Generate"**, the image is sent to `POST /api/generate` with the style slug
5. **Server-side**, the API route validates the file, fetches the hidden prompt from the style config, and passes both to the image generation service
6. **The service** processes the image (mock: returns original as base64; real: calls AI API) entirely **in memory**
7. **Result** is sent back as base64 JSON and stored in `sessionStorage` for the result page
8. **Result page** displays the image with download and "Try Again" buttons
9. **No permanent storage** — images exist only during processing and in the browser tab's session

## Architecture

```
src/
├── app/
│   ├── api/generate/route.ts   ← API endpoint (POST)
│   ├── create/page.tsx          ← Upload + generate page
│   ├── result/page.tsx          ← Result display page
│   ├── page.tsx                 ← Landing page
│   ├── layout.tsx               ← Root layout
│   └── globals.css              ← Global styles
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── BeforeAfter.tsx
│   ├── StyleCard.tsx
│   ├── ImageUpload.tsx
│   ├── LoadingState.tsx
│   └── ResultDisplay.tsx
├── lib/
│   └── validators.ts            ← Client + server file validation
├── services/
│   ├── styles.ts                ← Style configs with hidden prompts (SERVER-ONLY)
│   └── imageGeneration.ts       ← AI provider abstraction + mock
└── types/
    └── index.ts                 ← TypeScript type definitions
```

## Where Hidden Prompts Are Stored

Hidden prompts live in **`src/services/styles.ts`** — a server-only file.

- The `StyleConfig` type has a `hiddenPrompt` field
- `getPublicStyles()` and `getPublicStyleBySlug()` strip the prompt before returning data
- The API route calls `generateImage()` which internally reads the prompt — it never appears in any client response

## How to Replace the Mock Generator

1. Open `src/services/imageGeneration.ts`
2. Create a new class implementing `ImageGenerationProvider`:

```typescript
class ReplicateProvider implements ImageGenerationProvider {
  async generate(imageBuffer: Buffer, prompt: string, mimeType: string) {
    // Call the Replicate API (or Stability AI, OpenAI, etc.)
    const result = await replicate.run("model-id", {
      input: { image: imageBuffer.toString("base64"), prompt }
    });
    return { success: true, imageBase64: result.output, mimeType: "image/png" };
  }
}
```

3. Swap the `activeProvider` variable:

```typescript
const activeProvider: ImageGenerationProvider = new ReplicateProvider();
```

## Temporary File Handling

- **Upload**: File is read as `ArrayBuffer` → `Buffer` in the API route. No disk write.
- **Processing**: Buffer is passed to the provider in memory.
- **Response**: Result image is returned as base64 JSON.
- **Client storage**: `sessionStorage` holds the result — scoped to the browser tab and cleared on tab close.
- **Production upgrade path**: Replace `sessionStorage` with a short-lived signed URL from cloud storage (S3, Supabase Storage) and use a background job queue for long-running generation tasks.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
