"use client";

import { useActionState } from "react";
import { ShieldCheck } from "lucide-react";
import {
  requestClientAccess,
  type AccessActionState
} from "@/app/actions";
import { ContactSuccess } from "@/components/contact-success";
import { Button } from "@/components/ui/button";

const initialState: AccessActionState = {
  status: "idle",
  message: ""
};

export function ClientAccess() {
  const [state, formAction, isPending] = useActionState(
    requestClientAccess,
    initialState
  );

  return (
    <section id="contact" className="relative px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-6xl gap-8 rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-[0_30px_120px_rgba(0,0,0,0.32)] backdrop-blur-2xl md:grid-cols-[0.82fr_1.18fr] md:p-8">
        <div id="system" className="flex flex-col justify-between gap-10">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-primary">
              Espace client
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-none sm:text-6xl">
              Validation Neon avant chaque brief sensible.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-6 text-muted-foreground">
              Chaque demande cree un ticket, rattache le compte client et emet
              une verification temporaire. Le flux est pret pour email,
              dashboard et suivi prive.
            </p>
          </div>

          <div className="grid gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-background/40 p-4">
              <ShieldCheck aria-hidden="true" className="text-accent" />
              <span>Neon Auth provisionne pour sessions et JWT.</span>
            </div>
            <div className="rounded-lg border border-white/10 bg-background/40 p-4">
              Cloudinary est prepare avec transformations automatiques
              `f_auto,q_auto`.
            </div>
          </div>
        </div>

        <form action={formAction} className="grid gap-4" data-lenis-prevent>
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
              Maison / Societe
              <input
                name="company"
                className="h-12 rounded-lg border border-input bg-background/60 px-4 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
                placeholder="Maison Aurora"
              />
            </label>
            <label className="grid gap-2 text-sm text-muted-foreground">
              Budget
              <select
                name="budgetRange"
                className="h-12 rounded-lg border border-input bg-background/60 px-4 text-foreground outline-none transition-colors focus:border-primary"
                defaultValue="50k-100k"
              >
                <option value="25k-50k">25k - 50k</option>
                <option value="50k-100k">50k - 100k</option>
                <option value="100k+">100k+</option>
              </select>
            </label>
          </div>

          <label className="grid gap-2 text-sm text-muted-foreground">
            Type de projet
            <input
              name="projectType"
              required
              className="h-12 rounded-lg border border-input bg-background/60 px-4 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
              placeholder="Portfolio, e-commerce, espace client..."
            />
          </label>

          <label className="grid gap-2 text-sm text-muted-foreground">
            Brief
            <textarea
              name="message"
              required
              rows={6}
              className="resize-none rounded-lg border border-input bg-background/60 px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
              placeholder="Objectif, audience, delai, niveau de confidentialite..."
            />
          </label>

          {state.status === "success" ? (
            <ContactSuccess
              message={state.message}
              notificationStatus={state.notificationStatus}
            />
          ) : null}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p
              aria-live="polite"
              className={
                state.status === "error"
                  ? "text-sm text-destructive"
                  : "text-sm text-muted-foreground"
              }
            >
              {state.status === "success"
                ? "Reference ticket prete pour le suivi confidentiel."
                : state.message || "Les tickets sont stockes dans Neon Postgres."}
            </p>
            <Button type="submit" disabled={isPending} className="shrink-0">
              {isPending ? "Transmission..." : "Creer le ticket"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
