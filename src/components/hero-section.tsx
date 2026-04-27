"use client";

import { ArrowDown, Sparkles } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/magnetic-button";
import { ShaderBackground } from "@/components/shader-background";

const springTransition = {
  type: "spring",
  stiffness: 150,
  damping: 20
} as const;

const revealContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.16
    }
  }
};

const revealItem: Variants = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: springTransition
  }
};

export function HeroSection() {
  return (
    <section className="relative flex min-h-[92svh] items-end overflow-hidden px-5 pb-12 pt-32 sm:px-8 lg:px-10">
      <div className="luxury-grid absolute inset-0 opacity-50" aria-hidden="true" />
      <ShaderBackground />
      <div
        className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background via-background/70 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <motion.div
          variants={revealContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-8"
        >
          <motion.div
            variants={revealItem}
            className="flex w-fit items-center gap-2 rounded-full border border-white/5 bg-white/[0.035] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl"
          >
            <Sparkles aria-hidden="true" className="size-3.5 text-primary" />
            France / C4D / Communautés digitales
          </motion.div>

          <h1 className="max-w-6xl font-display text-[clamp(3rem,12vw,8.8rem)] font-semibold leading-[0.9] tracking-normal text-foreground">
            <span className="block overflow-hidden pb-3">
              <motion.span variants={revealItem} className="block">
                ANTIDZN —
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-3">
              <motion.span variants={revealItem} className="block">
                Direction Artistique & Systèmes Visuels.
              </motion.span>
            </span>
          </h1>

          <motion.div
            variants={revealItem}
            className="flex max-w-3xl flex-col gap-6 md:flex-row md:items-end md:justify-between"
          >
            <p className="max-w-2xl text-balance text-lg leading-8 text-muted-foreground sm:text-xl">
              Conception d'identités à fort caractère. Spécialisé en 3D (C4D)
              et branding de communautés digitales. Basé en France.
            </p>

            <div className="flex shrink-0 items-center gap-3">
              <MagneticButton href="#contact">Envoyer le brief</MagneticButton>
              <Button asChild variant="secondary" size="icon" aria-label="Voir les projets">
                <a href="#projects" data-cursor="voir">
                  <ArrowDown aria-hidden="true" />
                </a>
              </Button>
            </div>
          </motion.div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 28, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ ...springTransition, delay: 0.48 }}
          className="mb-1 hidden overflow-hidden rounded-lg border border-white/5 bg-white/[0.045] p-4 backdrop-blur-2xl lg:block"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Atelier privé
              </p>
              <p className="mt-1 font-display text-2xl font-semibold">
                C4D / Brand systems
              </p>
            </div>
            <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              Neon
            </span>
          </div>

          <div className="grid gap-3 pt-4">
            {[
              ["Tickets", "Briefs sécurisés", "01"],
              ["Projets", "Bento éditorial", "03"],
              ["Images", "Cloudinary f_auto", "AVIF"]
            ].map(([title, description, value]) => (
              <div
                key={title}
                className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-lg border border-white/5 bg-background/45 p-4"
              >
                <div>
                  <p className="font-medium text-foreground">{title}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                <p className="font-display text-2xl text-primary">{value}</p>
              </div>
            ))}
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
