import { useEffect, useRef, useState } from "react";
import { Mic, Square, Trash2, Upload, AudioLines } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export type AudioClip = { blob: Blob; name: string; url: string };

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioInput({
  clip,
  onClip,
  disabled,
}: {
  clip: AudioClip | null;
  onClip: (clip: AudioClip | null) => void;
  disabled?: boolean;
}) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!recording) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [recording]);

  const setClip = (blob: Blob, name: string) => {
    if (clip) URL.revokeObjectURL(clip.url);
    onClip({ blob, name, url: URL.createObjectURL(blob) });
  };

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4";
      const rec = new MediaRecorder(stream, { mimeType: mime });
      const chunks: BlobPart[] = [];
      rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, { type: mime });
        setClip(blob, `recording.${mime === "audio/webm" ? "webm" : "m4a"}`);
      };
      recorderRef.current = rec;
      setSeconds(0);
      rec.start();
      setRecording(true);
    } catch {
      toast.error("Microphone access is needed to record.");
    }
  };

  const stop = () => {
    recorderRef.current?.stop();
    recorderRef.current = null;
    setRecording(false);
  };

  const remove = () => {
    if (clip) URL.revokeObjectURL(clip.url);
    onClip(null);
  };

  return (
    <div className="space-y-3 rounded-xl border border-border bg-secondary/30 p-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2">
          <AudioLines className="size-4 text-primary" /> Meeting audio
        </Label>
        {recording && (
          <span className="flex items-center gap-2 text-xs text-destructive">
            <span className="size-2 animate-pulse rounded-full bg-destructive" /> Recording {fmt(seconds)}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {recording ? (
          <Button variant="secondary" size="sm" onClick={stop}>
            <Square className="size-3.5" /> Stop recording
          </Button>
        ) : (
          <Button variant="secondary" size="sm" onClick={start} disabled={disabled}>
            <Mic className="size-3.5" /> Record meeting
          </Button>
        )}
        <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()} disabled={disabled || recording}>
          <Upload className="size-3.5" /> Upload audio
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="audio/*,.mp3,.wav,.m4a,.webm"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setClip(f, f.name);
            e.target.value = "";
          }}
        />
      </div>

      {clip && (
        <div className="space-y-2 rounded-lg border border-border bg-card p-2.5">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-xs">
              <span className="font-medium">{clip.name}</span>{" "}
              <span className="text-muted-foreground">
                · {(clip.blob.size / 1024 / 1024).toFixed(2)} MB · {clip.blob.type || "audio"}
              </span>
            </p>
            <Button variant="ghost" size="sm" onClick={remove} disabled={disabled}>
              <Trash2 className="size-3.5" /> Remove
            </Button>
          </div>
          <audio controls src={clip.url} className="w-full" />
        </div>
      )}
    </div>
  );
}
