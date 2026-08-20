import { useCallback, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { runAiTool } from "@/lib/ai.functions";
import { logActivity, type ActivityKind } from "@/lib/activity";

type Tool = "email" | "meeting" | "tasks" | "research" | "chat";

const LOGGED: Partial<Record<Tool, { kind: ActivityKind; label: string }>> = {
  email: { kind: "email", label: "Email generated" },
  meeting: { kind: "meeting", label: "Meeting summarized" },
  research: { kind: "research", label: "Research briefing created" },
};


export function useAiTool(tool: Tool) {
  const run = useServerFn(runAiTool);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const last = useRef<string | null>(null);

  const generate = useCallback(
    async (prompt: string) => {
      last.current = prompt;
      setLoading(true);
      setError(null);
      try {
        const res = await run({ data: { tool, prompt } });
        setText(res.text);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [run, tool],
  );

  const regenerate = useCallback(() => {
    if (last.current) void generate(last.current);
  }, [generate]);

  const reset = useCallback(() => {
    setText("");
    setError(null);
    last.current = null;
  }, []);

  return { text, loading, error, generate, regenerate, reset, hasRun: !!last.current };
}
