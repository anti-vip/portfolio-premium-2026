"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import type { Project } from "@/lib/projects";

type ProjectDetailHeroProps = {
  project: Project;
  imageLayer: string;
};

const springTransition = {
  type: "spring",
  stiffness: 150,
  damping: 20
} as const;

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 }
};

export function ProjectDetailHero({ project, imageLayer }: ProjectDetailHeroProps) {
  return (
    <section className="relative min-h-[92svh] overflow-hidden px-5 pb-10 pt-28 sm:px-8 sm:pb-12 lg:px-10">
      <motion.div
        layoutId={`project-image-${project.slug}`}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: imageLayer }}
        aria-hidden="true"
        transition={springTransition}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-background via-background/70 to-transparent"
        aria-hidden="true"
      />
      <motion.div
        className="relative z-10 mx-auto flex min-h-[calc(92svh-9rem)] max-w-6xl flex-col justify-between"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.08, delayChildren: 0.1 }}
      >
        <motion.div variants={reveal} transition={springTransition}>
          <Link
            href="/#projects"
            data-cursor="voir"
            className="inline-flex min-h-11 w-fit items-center justify-center rounded-full border border-white/5 bg-white/[0.04] px-5 text-sm font-semibold text-foreground backdrop-blur-xl transition-colors hover:bg-white/[0.08]"
          >
            Retour aux projets
          </Link>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <motion.div className="mb-5 flex flex-wrap gap-2" variants={reveal} transition={springTransition}>
              <span className="inline-flex min-h-8 items-center rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
                {project.status}
              </span>
              {project.services.slice(0, 3).map((service) => (
                <span
                  key={service}
                  className="inline-flex min-h-8 items-center rounded-md border border-white/5 px-2.5 py-1 text-xs font-medium text-foreground"
                >
                  {service}
                </span>
              ))}
            </motion.div>
            <motion.h1
              layoutId={`project-title-${project.slug}`}
              className="max-w-5xl font-display text-[clamp(3.2rem,13vw,9rem)] font-semibold leading-[0.87] tracking-normal text-foreground"
              variants={reveal}
              transition={springTransition}
            >
              {project.title}
            </motion.h1>
          </div>
          <motion.div
            className="rounded-lg border border-white/5 bg-background/50 p-5 backdrop-blur-2xl sm:p-6"
            variants={reveal}
            transition={springTransition}
          >
            <p className="text-sm uppercase tracking-[0.22em] text-primary">
              Case study
            </p>
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              {project.summary}
            </p>
            <Link
              href="/#contact"
              data-cursor="contact"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Envoyer un brief similaire
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
