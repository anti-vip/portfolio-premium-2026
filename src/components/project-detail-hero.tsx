"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/projects";

type ProjectDetailHeroProps = {
  project: Project;
};

const gradients = [
  "radial-gradient(circle at 22% 18%, rgba(245,223,178,0.34), transparent 32%), radial-gradient(circle at 80% 22%, rgba(57,188,161,0.26), transparent 30%), linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
  "radial-gradient(circle at 72% 18%, rgba(116,132,255,0.3), transparent 34%), radial-gradient(circle at 20% 75%, rgba(245,223,178,0.22), transparent 28%), linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))"
];

export function ProjectDetailHero({ project }: ProjectDetailHeroProps) {
  const imageLayer = project.imageUrl
    ? `linear-gradient(180deg, rgba(5,5,7,0.08), rgba(5,5,7,0.86)), url(${project.imageUrl})`
    : gradients[project.sortOrder % gradients.length];

  return (
    <section className="relative min-h-[92svh] overflow-hidden px-5 pb-10 pt-28 sm:px-8 sm:pb-12 lg:px-10">
      <motion.div
        layoutId={`project-image-${project.slug}`}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: imageLayer }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,223,178,0.18),transparent_34rem)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-background via-background/70 to-transparent"
        aria-hidden="true"
      />

      <motion.div
        layoutId={`project-card-${project.slug}`}
        className="relative z-10 mx-auto flex min-h-[calc(92svh-9rem)] max-w-6xl flex-col justify-between"
        transition={{ duration: 0.78, ease: "easeOut" }}
      >
        <Button asChild variant="secondary" className="w-fit">
          <Link href="/#projects">
            <ArrowLeft aria-hidden="true" />
            Retour aux projets
          </Link>
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.82, delay: 0.16, ease: "easeOut" }}
          className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end"
        >
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              <Badge>{project.status}</Badge>
              {project.services.slice(0, 3).map((service) => (
                <Badge key={service} variant="outline">
                  {service}
                </Badge>
              ))}
            </div>
            <h1 className="max-w-5xl font-display text-[clamp(3.25rem,13vw,9.2rem)] font-semibold leading-[0.86] tracking-normal text-foreground">
              {project.title}
            </h1>
          </div>

          <div className="rounded-lg border border-white/10 bg-background/50 p-5 backdrop-blur-2xl sm:p-6">
            <p className="text-sm uppercase tracking-[0.22em] text-primary">
              Case study
            </p>
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              {project.summary}
            </p>
            <Button asChild className="mt-6">
              <Link href="/#contact">
                Lancer un brief similaire
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
