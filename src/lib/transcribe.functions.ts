import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  // base64 (no data: prefix)
  audio: z.string().min(100),
  mimeType: z.string().min(3).max(100),
  filename: z.string().min(1).max(200),
});

export const transcribeAudio = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured (missing API key).");

    const bytes = Uint8Array.from(atob(data.audio), (c) => c.charCodeAt(0));
    if (bytes.byteLength < 2048) throw new Error("That recording is too short or empty — please try again.");
    if (bytes.byteLength > 20 * 1024 * 1024) throw new Error("Audio file is too large (max 20MB).");

    const form = new FormData();
    form.append("model", "openai/gpt-4o-transcribe");
    form.append("file", new Blob([bytes], { type: data.mimeType }), data.filename);

    const res = await fetch("https://ai.gateway.lovable.dev/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}` },
      body: form,
    });

    if (!res.ok) {
      const body = await res.text();
      if (res.status === 429) throw new Error("Too many requests right now — please try again in a moment.");
      if (res.status === 402) throw new Error("AI credits are exhausted. Add credits in Lovable to continue.");
      throw new Error(`Transcription failed (${res.status}): ${body.slice(0, 300)}`);
    }

    const json = (await res.json()) as { text?: string };
    const text = json.text?.trim();
    if (!text) throw new Error("No speech was detected in that audio.");
    return { text };
  });
