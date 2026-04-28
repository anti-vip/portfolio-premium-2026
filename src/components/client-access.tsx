"use client";

import { useActionState, useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";
import {
  requestClientAccess,
  type AccessActionState
} from "@/app/actions";
import { ClientPortal } from "@/components/client-portal";
import { Button } from "@/components/ui/button";

const initialState: AccessActionState = {
  status: "idle",
  message: ""
};

function budgetLabel(value: number) {
  return value >= 3000 ? "3000€+" : `${value}€`;
}

function budgetRecommendation(value: number) {
  if (value < 650) {
    return "Idéal pour Identité V3";
  }

  if (value < 1500) {
    return "Branding Discord premium";
  }

  if (value < 2600) {
    return "Système visuel + assets 3D";
  }

  return "Direction Artistique 3D Complète";
}

function formatDateForInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function ClientAccess() {
  const [budget, setBudget] = useState(1500);
  const [state, formAction, isPending] = useActionState(
    requestClientAccess,
    initialState
  );

  const minimumLaunchDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 14);

    return formatDateForInput(date);
  }, []);

  const recommendation = budgetRecommendation(budget);
  const budgetRange = `${budgetLabel(budget)} — ${recommendation}`;

  return (
    <section id="contact" className="relative px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-6xl gap-8 rounded-lg border border-white/5 bg-white/[0.04] p-5 backdrop-blur-2xl md:grid-cols-[0.82fr_1.18fr] md:p-8">
        <div id="system" className="flex flex-col justify-between gap-8">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-primary">
              Espace client
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-none sm:text-6xl">
              Filtrer. Cadrer. Lancer proprement.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-6 text-muted-foreground">
              Chaque brief crée un ticket, rattache un compte client et fixe une
              date de lancement avant le premier échange.
            </p>
          </div>

          <div className="grid gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-background/40 p-4">
              <ShieldCheck aria-hidden="true" className="text-accent" />
              <span>Neon garde les comptes, codes et statuts de tickets.</span>
            </div>
            <div className="rounded-lg border border-white/5 bg-background/40 p-4">
              Cloudinary sert les visuels en `f_auto,q_auto`.
            </div>
          </div>

          <ClientPortal />
        </div>

        <form action={formAction} className="grid gap-4" data-lenis-prevent>
          <input name="budgetRange" type="hidden" value={budgetRange} />

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-muted-foreground">
              Nom
              <input
                name="name"
                required
                className="h-12 rounded-lg border border-input bg-background/60 px-4 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
                placeholder="Votre nom"
              />
            </label>
            <label className="grid gap-2 text-sm text-muted-foreground">
              Email
              <input
                name="email"
                type="email"
                required
                className="h-12 rounded-lg border border-input bg-background/60 px-4 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
                placeholder="vous@maison.com"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-muted-foreground">
              Maison / Société
              <input
                name="company"
                className="h-12 rounded-lg border border-input bg-background/60 px-4 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
                placeholder="Maison Aurora"
              />
            </label>
            <label className="grid gap-2 text-sm text-muted-foreground">
              Date de lancement souhaitée
              <input
                name="launchDate"
                type="date"
                min={minimumLaunchDate}
                required
                className="h-12 rounded-lg border border-input bg-background/60 px-4 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
              />
            </label>
          </div>

          <div className="rounded-lg border border-white/5 bg-background/40 p-4">
            <div className="flex items-end justify-between gap-4">
              <label
                className="text-sm text-muted-foreground"
                htmlFor="budget-slider"
              >
                Budget
              </label>
              <div className="text-right">
                <p className="font-display text-3xl font-semibold text-foreground">
                  {budgetLabel(budget)}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-primary">
                  {recommendation}
                </p>
              </div>
            </div>
            <input
              aria-label="Budget estimé"
              className="mt-5 h-2 w-full accent-primary"
              id="budget-slider"
              max={3000}
              min={150}
              onChange={(event) => setBudget(Number(event.target.value))}
              step={50}
              type="range"
              value={budget}
            />
            <div className="mt-3 flex justify-between text-xs text-muted-foreground">
              <span>150€</span>
              <span>3000€+</span>
            </div>
          </div>

          <label className="grid gap-2 text-sm text-muted-foreground">
            Type de projet
            <input
              name="projectType"
              required
              className="h-12 rounded-lg border border-input bg-background/60 px-4 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
              placeholder="Identité, 3D, communauté, refonte..."
            />
          </label>

          <label className="grid gap-2 text-sm text-muted-foreground">
            Brief
            <textarea
              name="message"
              required
              rows={6}
              className="resize-none rounded-lg border border-input bg-background/60 px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
              placeholder="Ce qui doit être vu, compris, ressenti. Le reste viendra après."
            />
          </label>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p
              aria-live="polite"
              className={
                state.status === "success"
                  ? "client-success-reveal text-sm text-accent"
                  : "text-sm text-muted-foreground"
              }
            >
              {state.message || "Le brief est filtré puis stocké dans Neon."}
            </p>
            <Button
              aria-disabled={isPending}
              className="shrink-0"
              disabled={isPending}
              type="submit"
            >
              Initier un projet
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
