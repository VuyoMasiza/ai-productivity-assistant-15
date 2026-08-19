import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  FileText,
  ListChecks,
  Search,
  MessageSquare,
  CheckCircle2,
  Sparkle,
  Clock,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "WorkFlow AI — AI Workplace Productivity Platform" },
      {
        name: "description",
        content:
          "One AI platform that helps employees write emails, summarize meetings, plan tasks, research topics and work more efficiently.",
      },
      { property: "og:title", content: "WorkFlow AI — AI Workplace Productivity Platform" },
      {
        property: "og:description",
        content: "Write, summarize, research and plan with one integrated AI workplace assistant.",
      },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email-generator",
    label: "Smart Email Generator",
    desc: "Turn a rough note into a polished email in any tone.",
    icon: Mail,
  },
  {
    to: "/meeting-summarizer",
    label: "Meeting Summarizer",
    desc: "Decisions, action items, deadlines and owners.",
    icon: FileText,
  },
  {
    to: "/task-planner",
    label: "AI Task Planner",
    desc: "Prioritised tasks and a time-blocked schedule.",
    icon: ListChecks,
  },
  {
    to: "/research-assistant",
    label: "Research Assistant",
    desc: "Structured briefings with insights and next steps.",
    icon: Search,
  },
  {
    to: "/assistant",
    label: "AI Assistant",
    desc: "Ask anything about your work, any time.",
    icon: MessageSquare,
  },
] as const;

const STATS = [
  { label: "Tasks completed", value: "8", icon: CheckCircle2 },
  { label: "AI-assisted tasks", value: "3", icon: Sparkle },
  { label: "Meetings summarized", value: "2", icon: FileText },
  { label: "Emails generated", value: "4", icon: Mail },
];

const ACTIVITY = [
  { text: "Client follow-up email generated", time: "12 min ago", icon: Mail },
  { text: "Monday team meeting summarized", time: "1 hr ago", icon: FileText },
  { text: "Weekly schedule created", time: "3 hrs ago", icon: ListChecks },
  { text: "Market research summarized", time: "Yesterday", icon: Search },
];

function Dashboard() {
  const [firstName, setFirstName] = useState<string>("");

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (!user) return;
      const meta = user.user_metadata as { full_name?: string } | undefined;
      const name = meta?.full_name?.trim() || user.email?.split("@")[0] || "";
      setFirstName(name.split(" ")[0] ?? "");
    });
  }, []);

  return (
    <AppShell>
      <section className="overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
          Tuesday · Good afternoon
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          One AI platform that helps you write, summarize, research, plan and work more efficiently
          — without switching between five different tools.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/assistant">
              Start with AI <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/email-generator">Generate an email</Link>
          </Button>
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{label}</p>
              <Icon className="size-4 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        AI tools
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {TOOLS.map(({ to, label, desc, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-colors hover:border-primary/60"
          >
            <div className="grid size-10 place-items-center rounded-xl bg-secondary/60 text-primary">
              <Icon className="size-5" />
            </div>
            <p className="mt-3 text-sm font-semibold">{label}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{desc}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
              Open tool <ArrowRight className="size-3" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Clock className="size-4 text-primary" /> Recent activity
          </h2>
          <ul className="mt-4 space-y-3">
            {ACTIVITY.map(({ text, time, icon: Icon }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-secondary/60 text-primary">
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm">{text}</span>
                <span className="text-[11px] text-muted-foreground">{time}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <TrendingUp className="size-4 text-primary" /> Productivity overview
          </h2>
          <div className="mt-4 space-y-4">
            {[
              { label: "Daily task goal", value: 80, hint: "8 of 10 tasks" },
              { label: "AI assistance used", value: 45, hint: "3 of 8 tasks AI-assisted" },
              { label: "Focus time today", value: 62, hint: "3h 45m of 6h" },
            ].map((b) => (
              <div key={b.label}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span>{b.label}</span>
                  <span className="text-muted-foreground">{b.hint}</span>
                </div>
                <Progress value={b.value} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
