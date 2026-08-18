import { Copy, RotateCcw, Sparkle, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AiMarkdown } from "@/components/AiMarkdown";

export function AiOutput({
  text,
  loading,
  error,
  emptyHint,
  onRegenerate,
}: {
  text: string;
  loading: boolean;
  error?: string | null;
  emptyHint: string;
  onRegenerate: () => void;
}) {
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <section className="flex min-h-[420px] flex-col rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
      <header className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <p className="flex items-center gap-2 text-sm font-medium">
          <Sparkle className="size-4 text-primary" /> AI output
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" disabled={!text || loading} onClick={copy}>
            <Copy className="size-3.5" /> Copy
          </Button>
          <Button variant="secondary" size="sm" disabled={loading} onClick={onRegenerate}>
            <RotateCcw className="size-3.5" /> Regenerate
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {loading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-3 animate-pulse rounded-full bg-secondary"
                style={{ width: `${90 - i * 9}%` }}
              />
            ))}
            <p className="pt-2 text-sm text-muted-foreground">WorkFlow AI is thinking…</p>
          </div>
        ) : error ? (
          <p className="flex items-start gap-2 text-sm text-destructive">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" /> {error}
          </p>
        ) : text ? (
          <AiMarkdown text={text} />
        ) : (
          <div className="grid h-full place-items-center px-6 text-center">
            <div>
              <div className="mx-auto grid size-12 place-items-center rounded-2xl border border-border bg-secondary/60 text-primary">
                <Sparkle className="size-5" />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{emptyHint}</p>
            </div>
          </div>
        )}
      </div>

      <footer className="border-t border-border px-4 py-2.5">
        <p className="text-[11px] text-muted-foreground">AI-generated — review before use.</p>
      </footer>
    </section>
  );
}
