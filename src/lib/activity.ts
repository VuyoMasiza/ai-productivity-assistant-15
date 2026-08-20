import { supabase } from "@/integrations/supabase/client";

export type ActivityKind = "email" | "meeting" | "task" | "research";

export type ActivityRow = {
  id: string;
  kind: ActivityKind;
  label: string;
  created_at: string;
};

/** Records a successfully completed action for the current user. Never throws. */
export async function logActivity(kind: ActivityKind, label: string) {
  try {
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) return;
    await supabase.from("activity_events").insert({ user_id: user.id, kind, label });
  } catch {
    /* activity logging must never break a tool */
  }
}

export async function fetchActivity(): Promise<ActivityRow[]> {
  const { data } = await supabase
    .from("activity_events")
    .select("id, kind, label, created_at")
    .order("created_at", { ascending: false })
    .limit(50);
  return (data ?? []) as ActivityRow[];
}

export function timeAgo(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? "Yesterday" : `${days} days ago`;
}
