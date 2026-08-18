import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Settings as SettingsIcon, ShieldAlert } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings | WorkFlow AI" },
      {
        name: "description",
        content: "Manage your WorkFlow AI profile, default writing tone and responsible AI preferences.",
      },
      { property: "og:title", content: "Settings | WorkFlow AI" },
      {
        property: "og:description",
        content: "Personalise WorkFlow AI defaults and responsible AI reminders.",
      },
    ],
  }),
  component: SettingsPage,
});

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:p-5">
      {children}
    </div>
  );
}

function SettingsPage() {
  const [name, setName] = useState("Vuyo Masiza");
  const [role, setRole] = useState("Operations Lead");
  const [tone, setTone] = useState("Formal");
  const [disclaimers, setDisclaimers] = useState(true);
  const [reminders, setReminders] = useState(true);

  return (
    <AppShell>
      <PageHeader
        icon={SettingsIcon}
        title="Settings"
        description="Personalise how WorkFlow AI writes and reminds you to work responsibly."
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <Row>
          <h2 className="text-sm font-semibold">Profile</h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Job title</Label>
              <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} />
            </div>
          </div>
        </Row>

        <Row>
          <h2 className="text-sm font-semibold">AI preferences</h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Default email tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Formal", "Friendly", "Persuasive"].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm">Show output disclaimers</p>
                <p className="text-xs text-muted-foreground">
                  Display "AI-generated — review before use" under every output.
                </p>
              </div>
              <Switch checked={disclaimers} onCheckedChange={setDisclaimers} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm">Responsible AI reminders</p>
                <p className="text-xs text-muted-foreground">
                  Remind me not to enter confidential information.
                </p>
              </div>
              <Switch checked={reminders} onCheckedChange={setReminders} />
            </div>
          </div>
        </Row>

        <div className="lg:col-span-2">
          <Row>
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <ShieldAlert className="size-4 text-primary" /> Responsible AI
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              AI-generated content may contain errors or incomplete information. Review and verify
              important information before using it for workplace, financial, legal, HR, or other
              high-impact decisions. Do not enter confidential, sensitive, or personal information
              into any WorkFlow AI tool.
            </p>
          </Row>
        </div>
      </div>
    </AppShell>
  );
}
