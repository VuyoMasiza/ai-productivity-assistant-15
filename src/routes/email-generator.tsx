import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Send, Eraser } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { AiOutput } from "@/components/AiOutput";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAiTool } from "@/lib/useAiTool";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/email-generator")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | WorkFlow AI" },
      {
        name: "description",
        content:
          "Turn a rough note into a polished workplace email with a formal, friendly or persuasive tone.",
      },
      { property: "og:title", content: "Smart Email Generator | WorkFlow AI" },
      {
        property: "og:description",
        content: "Draft professional workplace emails in seconds with WorkFlow AI.",
      },
    ],
  }),
  component: EmailGenerator,
});

const TONES = ["Formal", "Friendly", "Persuasive"] as const;

function EmailGenerator() {
  const [details, setDetails] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState<(typeof TONES)[number]>("Formal");
  const ai = useAiTool("email");

  const submit = () => {
    if (!details.trim()) return;
    void ai.generate(
      `Recipient: ${recipient || "colleague"}\nTone: ${tone}\nPurpose and details: ${details}`,
    );
  };

  return (
    <AppShell>
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Describe what you need to say — get a polished, ready-to-send workplace email."
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:p-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient (optional)</Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. My line manager, Sarah"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="details">Purpose and details</Label>
              <Textarea
                id="details"
                rows={9}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="e.g. I need to ask my manager for an extension on a project deadline because I need more time to complete the research."
              />
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <div className="flex flex-wrap gap-2">
                {TONES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-sm transition-colors",
                      tone === t
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button onClick={submit} disabled={ai.loading || !details.trim()}>
                <Send className="size-4" /> {ai.loading ? "Generating…" : "Generate email"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setDetails("");
                  setRecipient("");
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
          emptyHint="Your generated email will appear here."
        />
      </div>
    </AppShell>
  );
}
