"use client";

import { useActionState } from "react";
import { LoaderCircle, ShieldCheck } from "lucide-react";
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

export function ClientAccess() {
  const [state, formAction, isPending] = useActionState(
    requestClientAccess,
    initialState
  );

  return (
    <section id="contact" className="relative px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-6xl gap-8 rounded-lg border border-white/5 bg-white/[0.04] p-5 backdrop-blur-2xl md:grid-cols-[0.82fr_1.18fr] md:p-8">
        <div id="system" className="flex flex-col justify-between gap-8">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-primary">
              Espace client
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-none sm:text-6xl">
              Filtrer. Sécuriser. Ne garder que le nécessaire.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-6 text-muted-foreground">
              Chaque brief crée un ticket, rattache un compte client et garde la
              trace côté Neon avant toute prise de contact.
            </p>
          </div>

          <div className="grid gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-background/40 p-4">
              <ShieldCheck aria-hidden="true" className="text-accent" />
              <span>Neon gère les comptes, codes et statuts de tickets.</span>
            </div>
            <div className="rounded-lg border border-white/5 bg-background/40 p-4">
              Cloudinary sert les visuels en `f_auto,q_auto`.
            </div>
          </div>

          <ClientPortal />
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
              Maison / Société
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
                defaultValue="500€ — 2000€"
              >
                <option value="50€ — 500€">50€ — 500€</option>
                <option value="500€ — 2000€">500€ — 2000€</option>
                <option value="Projet Signature">Projet Signature</option>
              </select>
            </label>
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
              type="submit"
              disabled={isPending}
              className="shrink-0"
              data-cursor="contact"
            >
              {isPending ? (
                <>
                  <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                  Sécurisation du ticket sur Neon...
                </>
              ) : (
                "Envoyer le brief"
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
