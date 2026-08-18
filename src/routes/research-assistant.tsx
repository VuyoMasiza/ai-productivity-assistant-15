import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Sparkle, Eraser, ShieldAlert } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { AiOutput } from "@/components/AiOutput";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAiTool } from "@/lib/useAiTool";

const EXAMPLES = [
  "How can we reduce employee turnover in a small support team?",
  "What should we consider before adopting a 4-day work week?",
  "Best practices for running effective remote retrospectives",
];

export const Route = createFileRoute("/research-assistant")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | WorkFlow AI" },
      {
        name: "description",
        content:
          "Get a structured workplace research briefing: summary, insights, considerations, recommendations and next steps.",
      },
      { property: "og:title", content: "AI Research Assistant | WorkFlow AI" },
      {
        property: "og:description",
        content: "Structured workplace research briefings you can act on — always verify key facts.",
      },
    ],
  }),
  component: ResearchAssistant,
});

function ResearchAssistant() {
  const [topic, setTopic] = useState("");
  const ai = useAiTool("research");

  return (
    <AppShell>
      <PageHeader
        icon={Search}
        title="AI Research Assistant"
        description="Ask a workplace question and get a structured briefing you can act on."
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:p-5">
          <div className="space-y-3">
            <Label htmlFor="topic">Research question or topic</Label>
            <Textarea
              id="topic"
              rows={7}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. What should we consider before rolling out AI note-taking tools across the company?"
            />
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setTopic(ex)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                >
                  {ex}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button onClick={() => topic.trim() && ai.generate(topic)} disabled={ai.loading || !topic.trim()}>
                <Sparkle className="size-4" /> {ai.loading ? "Researching…" : "Research topic"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setTopic("");
                  ai.reset();
                }}
              >
                <Eraser className="size-4" /> Clear
              </Button>
            </div>
            <p className="flex items-start gap-2 rounded-xl border border-border bg-secondary/40 p-3 text-[11px] leading-relaxed text-muted-foreground">
              <ShieldAlert className="mt-0.5 size-3.5 shrink-0 text-primary" />
              Output is AI-generated and may be incomplete or out of date. Verify facts, figures and
              legal or HR guidance with primary sources before making decisions.
            </p>
          </div>
        </section>

        <AiOutput
          text={ai.text}
          loading={ai.loading}
          error={ai.error}
          onRegenerate={ai.regenerate}
          emptyHint="Summary, key insights, considerations, recommendations and next steps will appear here."
        />
      </div>
    </AppShell>
  );
}
