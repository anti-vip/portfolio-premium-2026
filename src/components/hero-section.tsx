"use client";

import { ArrowDown } from "lucide-react";
import { motion, type Transition, type Variants } from "framer-motion";
import { MagneticButton } from "@/components/magnetic-button";
import { ShaderBackground } from "@/components/shader-background";
import { Button } from "@/components/ui/button";

const springTransition: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 20
};

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
    <section className="relative flex min-h-[92svh] items-end overflow-hidden bg-black px-5 pb-12 pt-32 sm:px-8 lg:px-10">
      <div className="luxury-grid absolute inset-0 opacity-30" aria-hidden="true" />
      <ShaderBackground />
      <div
        className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/80 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <motion.div
          variants={revealContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-8"
        >
          <motion.div
            variants={revealItem}
            className="flex w-fit items-center gap-3 rounded-none border border-white/5 bg-black/50 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.25em] text-white/70 backdrop-blur-md"
          >
            <div className="relative flex h-2 w-2 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-40" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
            </div>
            DISPONIBILITÉ : 1 CRÉNEAU RESTANT
          </motion.div>

          <h1 className="max-w-6xl font-display text-[clamp(2.7rem,10vw,7.7rem)] font-medium leading-[0.9] tracking-normal text-white">
            <span className="block overflow-hidden pb-2">
              <motion.span variants={revealItem} className="block">
                ANTIDZN —
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-3">
              <motion.span variants={revealItem} className="block text-white/80">
                Direction Artistique & Systèmes Visuels.
              </motion.span>
            </span>
          </h1>

          <motion.div
            variants={revealItem}
            className="flex max-w-3xl flex-col gap-8 md:flex-row md:items-end md:justify-between"
          >
            <p className="max-w-md text-balance text-sm leading-relaxed tracking-wide text-white/50">
              {
                "Conception d'identités à fort caractère. Spécialisé en 3D (C4D) et branding de communautés digitales. Basé en France."
              }
            </p>

            <div className="flex shrink-0 items-center gap-4">
              <MagneticButton href="#contact">
                Initier un projet
              </MagneticButton>
              <Button
                asChild
                variant="outline"
                size="icon"
                className="rounded-none border-white/5 bg-transparent hover:bg-white/5"
              >
                <a href="#projects" aria-label="Voir le portfolio">
                  <ArrowDown aria-hidden="true" className="size-4 text-white/70" />
                </a>
              </Button>
            </div>
          </motion.div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ ...springTransition, delay: 0.4 }}
          className="mb-1 hidden overflow-hidden rounded-none border border-white/5 bg-black/40 p-6 backdrop-blur-xl lg:block"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                Méthodologie
              </p>
              <p className="mt-2 font-display text-lg tracking-wide text-white/90">
                Processus Studio
              </p>
            </div>
            <span className="rounded-none border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-wider text-white/60">
              2026
            </span>
          </div>

          <div className="grid gap-2 pt-5">
            {[
              ["01", "Cadrage Stratégique", "Audit & direction visuelle"],
              ["02", "Production Studio", "Design 3D & interfaces"],
              ["03", "Déploiement", "Assets finaux, prêts à servir"]
            ].map(([step, title, description]) => (
              <div
                key={step}
                className="grid grid-cols-[auto_1fr] items-center gap-5 border border-transparent border-b-white/5 bg-transparent p-3 transition-colors hover:bg-white/[0.02]"
              >
                <p className="font-display text-sm text-white/30">{step}</p>
                <div>
                  <p className="text-sm tracking-wide text-white/80">{title}</p>
                  <p className="mt-0.5 text-[11px] text-white/40">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
