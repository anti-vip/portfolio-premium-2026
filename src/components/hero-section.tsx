"use client";

import { ArrowDown, Sparkles } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/magnetic-button";
import { ShaderBackground } from "@/components/shader-background";

const revealContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.18
    }
  }
};

const revealItem: Variants = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.9, ease: "easeOut" }
  }
};

export function HeroSection() {
  return (
    <section className="relative flex min-h-[92svh] items-end overflow-hidden px-5 pb-12 pt-32 sm:px-8 lg:px-10">
      <div className="luxury-grid absolute inset-0 opacity-60" aria-hidden="true" />
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
            className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl"
          >
            <Sparkles aria-hidden="true" className="size-3.5 text-primary" />
            Senior Creative Developer / Luxury Digital
          </motion.div>

          <h1 className="max-w-5xl font-display text-[clamp(3.35rem,15vw,9.8rem)] font-semibold leading-[0.86] tracking-normal text-foreground">
            <span className="block overflow-hidden pb-3">
              <motion.span variants={revealItem} className="block">
                Portfolio
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-3">
              <motion.span
                variants={revealItem}
                className="block bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent"
              >
                Premium 2026
              </motion.span>
            </span>
          </h1>

          <motion.div
            variants={revealItem}
            className="flex max-w-3xl flex-col gap-6 md:flex-row md:items-end md:justify-between"
          >
            <p className="max-w-2xl text-balance text-lg leading-8 text-muted-foreground sm:text-xl">
              Direction digitale haut de gamme pour maisons ambitieuses :
              interfaces sombres, narration precise, motion fluide et espace
              client securise par Neon.
            </p>

            <div className="flex shrink-0 items-center gap-3">
              <MagneticButton href="#contact">
                Ouvrir un ticket prive
              </MagneticButton>
              <Button asChild variant="secondary" size="icon" aria-label="Voir les projets">
                <a href="#projects">
                  <ArrowDown aria-hidden="true" />
                </a>
              </Button>
            </div>
          </motion.div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 28, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, delay: 0.65, ease: "easeOut" }}
          className="mb-1 hidden overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-2xl lg:block"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Client room
              </p>
              <p className="mt-1 font-display text-2xl font-semibold">
                Access verified
              </p>
            </div>
            <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              Neon Auth
            </span>
          </div>

          <div className="grid gap-3 pt-4">
            {[
              ["Tickets", "Contact pipeline", "01"],
              ["Projects", "Bento CMS-ready", "03"],
              ["Media", "Cloudinary f_auto", "AVIF"]
            ].map(([title, description, value]) => (
              <div
                key={title}
                className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-lg border border-white/10 bg-background/50 p-4"
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
