import type { ReactNode } from "react";
import { Workflow } from "lucide-react";

export function AuthLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-card)]">
            <Workflow className="size-5" />
          </div>
          <p className="text-sm font-semibold tracking-tight">WorkFlow AI</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          <div className="mt-6">{children}</div>
        </div>
        <p className="mt-6 text-center text-[11px] leading-relaxed text-muted-foreground">
          Your account uses secure authentication. Do not enter passwords, confidential company
          information, financial information, or sensitive personal information into AI tools.
        </p>
      </div>
    </div>
  );
}
