import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MessageSquare, SendHorizontal, Eraser, Workflow } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { AiMarkdown } from "@/components/AiMarkdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { runAiTool } from "@/lib/ai.functions";

export const Route = createFileRoute("/_authenticated/assistant")({
  head: () => ({
    meta: [
      { title: "AI Workplace Assistant | WorkFlow AI" },
      {
        name: "description",
        content:
          "Chat with a workplace AI assistant for presentations, prioritisation, difficult emails and productivity ideas.",
      },
      { property: "og:title", content: "AI Workplace Assistant | WorkFlow AI" },
      {
        property: "og:description",
        content: "Your always-on workplace assistant for writing, planning and problem solving.",
      },
    ],
  }),
  component: Assistant,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Help me prepare for a presentation.",
  "How should I prioritize these tasks?",
  "Write a professional response to a difficult client.",
  "Give me ideas for improving team productivity.",
];

function Assistant() {
  const run = useServerFn(runAiTool);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const prompt = text.trim();
    if (!prompt || loading) return;
    const history = messages.slice(-10);
    setMessages((m) => [...m, { role: "user", content: prompt }]);
    setInput("");
    setLoading(true);
    try {
      const res = await run({ data: { tool: "chat" as const, prompt, history } });
      setMessages((m) => [...m, { role: "assistant", content: res.text }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: e instanceof Error ? e.message : "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        icon={MessageSquare}
        title="AI Workplace Assistant"
        description="Ask anything about your work — writing, planning, communication or productivity."
      />

      <section className="flex h-[65vh] min-h-[480px] flex-col rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5">
          {!messages.length && (
            <div className="grid h-full place-items-center text-center">
              <div className="max-w-md">
                <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground">
                  <Workflow className="size-6" />
                </div>
                <p className="mt-3 text-sm font-medium">How can I help you at work today?</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => void send(s)}
                      className="rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-left text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                  {m.content}
                </div>
              </div>
            ) : (
              <div key={i} className="flex gap-3">
                <div className="mt-1 grid size-7 shrink-0 place-items-center rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground">
                  <Workflow className="size-3.5" />
                </div>
                <div className="min-w-0 max-w-[90%]">
                  <AiMarkdown text={m.content} />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    AI-generated — review before use.
                  </p>
                </div>
              </div>
            ),
          )}

          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-2 animate-pulse rounded-full bg-primary" /> Thinking…
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border p-3">
          <div className="flex items-end gap-2">
            <Textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
              placeholder="Ask your workplace assistant…"
              className="min-h-11 resize-none"
            />
            <Button size="icon" aria-label="Send" onClick={() => void send(input)} disabled={loading || !input.trim()}>
              <SendHorizontal className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Clear chat"
              onClick={() => setMessages([])}
              disabled={!messages.length}
            >
              <Eraser className="size-4" />
            </Button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
