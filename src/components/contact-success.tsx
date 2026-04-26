"use client";

import { ShieldCheck } from "lucide-react";

type ContactSuccessProps = {
  message: string;
  notificationStatus?: "sent" | "skipped" | "failed";
};

export function ContactSuccess({
  message,
  notificationStatus
}: ContactSuccessProps) {
  return (
    <div className="client-success-reveal relative overflow-hidden rounded-lg border border-accent/25 bg-accent/10 p-4 text-sm text-foreground shadow-[0_18px_70px_rgba(182,242,222,0.08)]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 10% 0%, rgba(182,242,222,0.22), transparent 32%)"
        }}
        aria-hidden="true"
      />
      <div className="relative flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full border border-accent/30 bg-accent/15 text-accent">
          <ShieldCheck aria-hidden="true" className="size-5" />
        </span>
        <div>
          <p className="font-medium text-foreground">
            Demande securisee dans l'espace client.
          </p>
          <p className="mt-1 leading-6 text-muted-foreground">{message}</p>
          {notificationStatus === "sent" ? (
            <p className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-accent">
              <ShieldCheck aria-hidden="true" className="size-4" />
              Notification SendGrid envoyee
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
