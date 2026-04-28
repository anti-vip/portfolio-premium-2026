"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";

import {
  requestClientLoginCode,
  verifyClientLoginCode,
  type ClientAuthState,
  type TicketSummary
} from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const springTransition = {
  type: "spring",
  stiffness: 120,
  damping: 20
} as const;

const initialCodeState: ClientAuthState = {
  status: "idle",
  step: "request",
  message: ""
};

const initialVerifyState: ClientAuthState = {
  status: "idle",
  step: "verify",
  message: ""
};

const timelineSteps = [
  "Brief reçu",
  "Rendu 3D en cours",
  "Validation",
  "Assets livrés"
];

const statusCopy: Record<string, { label: string; className: string }> = {
  new: {
    label: "En attente",
    className: "border-primary/30 bg-primary/10 text-primary"
  },
  pending: {
    label: "En attente",
    className: "border-primary/30 bg-primary/10 text-primary"
  },
  in_progress: {
    label: "En cours",
    className: "border-accent/30 bg-accent/10 text-accent"
  },
  "in-progress": {
    label: "En cours",
    className: "border-accent/30 bg-accent/10 text-accent"
  },
  done: {
    label: "Terminé",
    className: "border-white/15 bg-white/[0.08] text-foreground"
  },
  completed: {
    label: "Terminé",
    className: "border-white/15 bg-white/[0.08] text-foreground"
  },
  closed: {
    label: "Terminé",
    className: "border-white/15 bg-white/[0.08] text-foreground"
  }
};

function ticketStatus(status: string) {
  return (
    statusCopy[status.toLowerCase()] ?? {
      label: status,
      className: "border-white/15 bg-white/[0.06] text-muted-foreground"
    }
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

function TicketRow({ ticket }: { ticket: TicketSummary }) {
  const status = ticketStatus(ticket.status);
  const currentStep = Math.min(Math.max(ticket.statusStep ?? 1, 1), 4);
  const launchDate = ticket.launchDate ? formatDate(ticket.launchDate) : null;

  return (
    <li className="rounded-lg border border-white/5 bg-background/40 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-medium text-foreground">{ticket.projectType}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {formatDate(ticket.createdAt)} / Priorité {ticket.priority}
            {launchDate ? ` / Lancement ${launchDate}` : ""}
          </p>
        </div>
        <span
          className={[
            "inline-flex min-h-8 w-fit items-center rounded-full border px-3 text-xs font-medium",
            status.className
          ].join(" ")}
        >
          {status.label}
        </span>
      </div>

      <ol className="mt-5 grid gap-3 sm:grid-cols-4">
        {timelineSteps.map((step, index) => {
          const stepIndex = index + 1;
          const isActive = stepIndex <= currentStep;

          return (
            <li className="relative" key={step}>
              <div
                className={[
                  "flex min-h-11 items-center gap-3 rounded-lg border px-3 text-xs font-medium",
                  isActive
                    ? "border-primary/25 bg-primary/10 text-primary"
                    : "border-white/5 bg-white/[0.025] text-muted-foreground"
                ].join(" ")}
              >
                <span
                  className={[
                    "grid size-6 shrink-0 place-items-center rounded-full border text-[10px]",
                    isActive
                      ? "border-primary/35 text-primary"
                      : "border-white/10 text-muted-foreground"
                  ].join(" ")}
                >
                  {stepIndex}
                </span>
                {step}
              </div>
            </li>
          );
        })}
      </ol>
    </li>
  );
}

export function ClientPortal() {
  const [codeState, requestCodeAction, isCodePending] = useActionState(
    requestClientLoginCode,
    initialCodeState
  );
  const [verifyState, verifyCodeAction, isVerifyPending] = useActionState(
    verifyClientLoginCode,
    initialVerifyState
  );

  const dashboardOpen = verifyState.step === "authenticated";
  const portalEmail = codeState.email ?? verifyState.email ?? "";

  return (
    <div className="rounded-lg border border-white/5 bg-background/40 p-4 backdrop-blur-xl sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-primary">
            Portail tickets
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Connexion par email et code temporaire stocké dans Neon.
          </p>
        </div>
        <Badge variant="outline">Email + Code</Badge>
      </div>

      {!dashboardOpen ? (
        <div className="mt-5 grid gap-4">
          <form action={requestCodeAction} className="grid gap-3" data-lenis-prevent>
            <label className="grid gap-2 text-sm text-muted-foreground">
              Email client
              <input
                name="portalEmail"
                type="email"
                required
                className="h-12 rounded-lg border border-input bg-background/60 px-4 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
                placeholder="client@maison.com"
              />
            </label>
            <Button
              type="submit"
              variant="secondary"
              disabled={isCodePending}
            >
              Recevoir un code
            </Button>
          </form>

          <form action={verifyCodeAction} className="grid gap-3" data-lenis-prevent>
            <input type="hidden" name="portalEmail" value={portalEmail} />
            <label className="grid gap-2 text-sm text-muted-foreground">
              Code à 6 chiffres
              <input
                name="portalCode"
                inputMode="numeric"
                pattern="[0-9]{6}"
                required
                className="h-12 rounded-lg border border-input bg-background/60 px-4 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
                placeholder="000000"
              />
            </label>
            <Button type="submit" disabled={isVerifyPending || !portalEmail}>
              Ouvrir le dashboard
            </Button>
          </form>
        </div>
      ) : (
        <motion.div
          className="mt-5"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springTransition}
        >
          <div className="mb-4 rounded-lg border border-accent/20 bg-accent/10 p-4 text-sm text-accent">
            {verifyState.message}
          </div>
          <ul className="grid gap-3">
            {(verifyState.tickets ?? []).map((ticket) => (
              <TicketRow key={ticket.id} ticket={ticket} />
            ))}
          </ul>
        </motion.div>
      )}

      {!dashboardOpen ? (
        <div className="mt-4 space-y-2 text-sm" aria-live="polite">
          {codeState.message ? (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={springTransition}
              className={
                codeState.status === "success"
                  ? "text-accent"
                  : "text-muted-foreground"
              }
            >
              {codeState.message}
            </motion.p>
          ) : null}
          {verifyState.message ? (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={springTransition}
              className={
                verifyState.status === "success"
                  ? "text-accent"
                  : "text-muted-foreground"
              }
            >
              {verifyState.message}
            </motion.p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
