import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MailCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/verify-email")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    email: typeof search['email'] === "string" ? (search['email'] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Verify your email — WorkFlow AI" },
      { name: "description", content: "Confirm your email address to activate your WorkFlow AI account." },
      { property: "og:title", content: "Verify your email — WorkFlow AI" },
      { property: "og:description", content: "Confirm your email address to activate your WorkFlow AI account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [email, setEmail] = useState<string | undefined>(search.email);
  const [status, setStatus] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let active = true;
    const check = async () => {
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      if (data.user?.email && !email) setEmail(data.user.email);
      if (data.user?.email_confirmed_at) void navigate({ to: "/" });
    };
    void check();
    const timer = setInterval(check, 5000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [email, navigate]);

  async function resend() {
    if (!email) {
      setStatus("Enter your email on the login page and try again.");
      return;
    }
    setSending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    setSending(false);
    setStatus(error ? error.message : "Verification email sent. Check your inbox.");
  }

  return (
    <AuthLayout
      title="Check your email"
      description={
        email
          ? `We sent a verification link to ${email}. Click it to activate your account.`
          : "We sent you a verification link. Click it to activate your account."
      }
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="grid size-12 place-items-center rounded-xl border border-border bg-secondary text-primary">
          <MailCheck className="size-6" />
        </div>
        <p className="text-sm text-muted-foreground">
          Email verification is required before you can access the dashboard. This page updates
          automatically once you're verified.
        </p>
        {status && <p className="text-sm text-foreground">{status}</p>}
        <Button className="w-full" onClick={resend} disabled={sending}>
          {sending ? "Sending…" : "Resend Verification Email"}
        </Button>
        <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
          Back to Login
        </Link>
      </div>
    </AuthLayout>
  );
}
