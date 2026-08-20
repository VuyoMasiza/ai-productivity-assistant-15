import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Sparkle, Eraser, AudioLines } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell, PageHeader } from "@/components/AppShell";
import { AiOutput } from "@/components/AiOutput";
import { AudioInput, type AudioClip } from "@/components/AudioInput";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAiTool } from "@/lib/useAiTool";
import { transcribeAudio } from "@/lib/transcribe.functions";


const SAMPLE = `Monday standup - product team
Thabo said the onboarding redesign is 70% done, blocked on copy from marketing. Lerato will send final copy by Thursday.
We agreed to postpone the mobile push notifications feature to next sprint.
Support tickets are up 12% after the last release; Naledi to investigate root cause and report back Friday.
Budget for the new analytics tool was approved. Sipho will handle procurement before month end.`;

export const Route = createFileRoute("/_authenticated/meeting-summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | WorkFlow AI" },
      {
        name: "description",
        content:
          "Paste raw meeting notes and get a structured summary with decisions, action items, deadlines and owners.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer | WorkFlow AI" },
      {
        property: "og:description",
        content: "Turn messy meeting notes into decisions, actions, deadlines and owners.",
      },
    ],
  }),
  component: MeetingSummarizer,
});

function MeetingSummarizer() {
  const [notes, setNotes] = useState("");
  const [clip, setClip] = useState<AudioClip | null>(null);
  const [transcribing, setTranscribing] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const transcribe = useServerFn(transcribeAudio);
  const ai = useAiTool("meeting");

  const toBase64 = (blob: Blob) =>
    new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result).split(",")[1] ?? "");
      r.onerror = () => reject(new Error("Could not read the audio file."));
      r.readAsDataURL(blob);
    });

  const runTranscribe = async (autoSummarize: boolean) => {
    if (!clip) return;
    setTranscribing(true);
    setAudioError(null);
    try {
      const audio = await toBase64(clip.blob);
      const res = await transcribe({
        data: { audio, mimeType: clip.blob.type || "audio/webm", filename: clip.name },
      });
      const text = notes.trim() ? `${notes.trim()}\n\n${res.text}` : res.text;
      setNotes(text);
      if (autoSummarize) await ai.generate(text);
    } catch (e) {
      setAudioError(e instanceof Error ? e.message : "Transcription failed. Please try again.");
    } finally {
      setTranscribing(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        icon={FileText}
        title="Meeting Notes Summarizer"
        description="Paste raw notes — get a scannable summary with decisions, actions, deadlines and owners."
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:p-5">
          <div className="space-y-3">
            <AudioInput clip={clip} onClip={setClip} disabled={transcribing || ai.loading} />
            {clip && (
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={() => void runTranscribe(false)} disabled={transcribing || ai.loading}>
                  <AudioLines className="size-3.5" /> {transcribing ? "Transcribing…" : "Transcribe to notes"}
                </Button>
                <Button size="sm" onClick={() => void runTranscribe(true)} disabled={transcribing || ai.loading}>
                  <Sparkle className="size-3.5" /> Transcribe & summarize
                </Button>
              </div>
            )}
            {audioError && (
              <p className="rounded-lg border border-destructive/40 bg-destructive/10 p-2.5 text-xs text-destructive">
                {audioError}
              </p>
            )}
            <div className="flex items-center justify-between">
              <Label htmlFor="notes">Meeting notes</Label>
              <button
                type="button"
                onClick={() => setNotes(SAMPLE)}
                className="text-xs text-primary hover:underline"
              >
                Use sample notes
              </button>
            </div>
            <Textarea
              id="notes"
              rows={16}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste your full meeting notes or transcript here…"
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => notes.trim() && ai.generate(notes)} disabled={ai.loading || !notes.trim()}>
                <Sparkle className="size-4" /> {ai.loading ? "Summarizing…" : "Summarize notes"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setNotes("");
                  ai.reset();
                }}
              >
                <Eraser className="size-4" /> Clear
              </Button>
            </div>
          </div>
        </section>

        <AiOutput
          text={ai.text}
          loading={ai.loading}
          error={ai.error}
          onRegenerate={ai.regenerate}
          emptyHint="Summary, key decisions, action items, deadlines and owners will appear here."
        />
      </div>
    </AppShell>
  );
}
