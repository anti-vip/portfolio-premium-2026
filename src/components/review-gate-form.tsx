"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import {
  submitVerifiedReview,
  type ReviewGateState
} from "@/app/review-gate/actions";
import { Button } from "@/components/ui/button";

const initialState: ReviewGateState = {
  status: "idle",
  message: ""
};

const springTransition = {
  type: "spring",
  stiffness: 120,
  damping: 20
} as const;

export function ReviewGateForm({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState(
    submitVerifiedReview,
    initialState
  );

  return (
    <form
      action={formAction}
      className="mx-auto grid w-full max-w-2xl gap-4 rounded-lg border border-white/5 bg-white/[0.04] p-5 backdrop-blur-2xl sm:p-8"
      data-lenis-prevent
    >
      <input name="reviewToken" type="hidden" value={token} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-muted-foreground">
          Projet
          <input
            className="h-12 rounded-lg border border-input bg-background/60 px-4 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
            name="projectName"
            placeholder="Maison Aurora"
            required
          />
        </label>

        <label className="grid gap-2 text-sm text-muted-foreground">
          Note
          <select
            className="h-12 rounded-lg border border-input bg-background/60 px-4 text-foreground outline-none transition-colors focus:border-primary"
            defaultValue="5"
            name="ratingStars"
          >
            <option value="5">5 / 5</option>
            <option value="4">4 / 5</option>
            <option value="3">3 / 5</option>
            <option value="2">2 / 5</option>
            <option value="1">1 / 5</option>
          </select>
        </label>
      </div>

      <label className="grid gap-2 text-sm text-muted-foreground">
        ID client vérifié
        <input
          className="h-12 rounded-lg border border-input bg-background/60 px-4 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
          name="verifiedClientId"
          placeholder="uuid client Neon"
        />
      </label>

      <label className="grid gap-2 text-sm text-muted-foreground">
        Avis
        <textarea
          className="min-h-36 resize-none rounded-lg border border-input bg-background/60 px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
          name="content"
          placeholder="Ce qui a changé après la livraison."
          required
        />
      </label>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {state.message || "Une phrase nette. Pas de roman."}
        </p>
        <Button className="shrink-0" disabled={isPending} type="submit">
          Signer l&apos;avis
        </Button>
      </div>

      {state.status === "success" ? (
        <motion.div
          className="rounded-lg border border-accent/20 bg-accent/10 p-4 text-sm text-accent"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springTransition}
        >
          {state.message}
        </motion.div>
      ) : null}
    </form>
  );
}
