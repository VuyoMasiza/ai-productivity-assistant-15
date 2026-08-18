import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ListChecks, CalendarClock, Eraser, Plus, X } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { AiOutput } from "@/components/AiOutput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAiTool } from "@/lib/useAiTool";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Task = { id: number; title: string; priority: string; deadline: string; estimate: string };

let nextId = 4;
const INITIAL: Task[] = [
  { id: 1, title: "Finish Q3 client report", priority: "High", deadline: "Today 16:00", estimate: "2h" },
  { id: 2, title: "Review design handover", priority: "Medium", deadline: "Tomorrow", estimate: "45m" },
  { id: 3, title: "Update team wiki", priority: "Low", deadline: "This week", estimate: "30m" },
];

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | WorkFlow AI" },
      {
        name: "description",
        content:
          "Enter your tasks with priorities and deadlines and get a practical, time-blocked daily schedule.",
      },
      { property: "og:title", content: "AI Task Planner | WorkFlow AI" },
      {
        property: "og:description",
        content: "Turn a messy task list into a prioritised, time-blocked working day.",
      },
    ],
  }),
  component: TaskPlanner,
});

function TaskPlanner() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL);
  const [draft, setDraft] = useState<Omit<Task, "id">>({
    title: "",
    priority: "Medium",
    deadline: "",
    estimate: "",
  });
  const ai = useAiTool("tasks");

  const add = () => {
    if (!draft.title.trim()) return;
    setTasks((t) => [...t, { id: nextId++, ...draft }]);
    setDraft({ title: "", priority: "Medium", deadline: "", estimate: "" });
  };

  const plan = () => {
    if (!tasks.length) return;
    const list = tasks
      .map(
        (t) =>
          `- ${t.title} | priority: ${t.priority} | deadline: ${t.deadline || "unspecified"} | estimate: ${t.estimate || "unspecified"}`,
      )
      .join("\n");
    void ai.generate(`Working day starts at 09:00 and ends at 17:00.\nTasks:\n${list}`);
  };

  return (
    <AppShell>
      <PageHeader
        icon={ListChecks}
        title="AI Task Planner"
        description="Add your tasks and let AI prioritise them into a realistic daily schedule."
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title">Task</Label>
              <Input
                id="title"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="e.g. Prepare board presentation slides"
                onKeyDown={(e) => e.key === "Enter" && add()}
              />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={draft.priority}
                onValueChange={(v) => setDraft({ ...draft, priority: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["High", "Medium", "Low"].map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline (optional)</Label>
              <Input
                id="deadline"
                value={draft.deadline}
                onChange={(e) => setDraft({ ...draft, deadline: e.target.value })}
                placeholder="e.g. Friday 12:00"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="estimate">Estimated time (optional)</Label>
              <Input
                id="estimate"
                value={draft.estimate}
                onChange={(e) => setDraft({ ...draft, estimate: e.target.value })}
                placeholder="e.g. 1h 30m"
              />
            </div>
          </div>

          <Button variant="secondary" className="mt-3 w-full" onClick={add}>
            <Plus className="size-4" /> Add task
          </Button>

          <ul className="mt-4 space-y-2">
            {tasks.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-secondary/40 px-3 py-2.5"
              >
                <span
                  className={
                    "size-2 shrink-0 rounded-full " +
                    (t.priority === "High"
                      ? "bg-destructive"
                      : t.priority === "Medium"
                        ? "bg-primary"
                        : "bg-muted-foreground")
                  }
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{t.title}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {t.priority}
                    {t.deadline && ` · ${t.deadline}`}
                    {t.estimate && ` · ${t.estimate}`}
                  </p>
                </div>
                <button
                  aria-label="Remove task"
                  onClick={() => setTasks((list) => list.filter((x) => x.id !== t.id))}
                  className="text-muted-foreground transition-colors hover:text-destructive"
                >
                  <X className="size-4" />
                </button>
              </li>
            ))}
            {!tasks.length && (
              <li className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
                No tasks yet — add your first one above.
              </li>
            )}
          </ul>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={plan} disabled={ai.loading || !tasks.length}>
              <CalendarClock className="size-4" /> {ai.loading ? "Planning…" : "Plan my day"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setTasks([]);
                ai.reset();
              }}
            >
              <Eraser className="size-4" /> Clear all
            </Button>
          </div>
        </section>

        <AiOutput
          text={ai.text}
          loading={ai.loading}
          error={ai.error}
          onRegenerate={ai.regenerate}
          emptyHint="Your prioritised tasks and recommended schedule will appear here."
        />
      </div>
    </AppShell>
  );
}
