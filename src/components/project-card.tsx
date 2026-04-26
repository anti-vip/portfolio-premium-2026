"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/projects";

type ProjectCardProps = {
  project: Project;
  index: number;
  featured: boolean;
  imageLayer: string;
  slotClassName: string;
};

const statusLabels: Record<string, string> = {
  live: "Live",
  prototype: "Prototype",
  concept: "Concept"
};

function formatProjectStatus(status: string) {
  return statusLabels[status.toLowerCase()] ?? status;
}

export function ProjectCard({
  featured,
  imageLayer,
  index,
  project,
  slotClassName
}: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={[
        "group block h-full min-h-[260px] focus:outline-none",
        slotClassName
      ].join(" ")}
      aria-label={`Ouvrir le projet ${project.title}`}
    >
      <motion.article
        layoutId={`project-card-${project.slug}`}
        className={[
          "relative h-full overflow-hidden rounded-lg border border-white/10 bg-card p-5 shadow-[0_24px_90px_rgba(0,0,0,0.28)]",
          "transition-all duration-500 group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:shadow-[0_34px_120px_rgba(245,223,178,0.12)]",
          "group-focus-visible:ring-2 group-focus-visible:ring-primary group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background"
        ].join(" ")}
        transition={{ duration: 0.72, ease: "easeOut" }}
      >
        <motion.div
          layoutId={`project-image-${project.slug}`}
          className="absolute inset-0 scale-100 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
          style={{ backgroundImage: imageLayer }}
          aria-hidden="true"
          transition={{ duration: 0.82, ease: "easeOut" }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-80"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle at 20% 10%, rgba(245,223,178,0.2), transparent 26%)"
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-x-5 top-5 flex items-center justify-between">
          <Badge>{formatProjectStatus(project.status)}</Badge>
          <span className="font-display text-sm text-primary/80">
            0{index + 1}
          </span>
        </div>
        <div className="absolute right-5 top-16 translate-y-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary opacity-0 backdrop-blur-xl transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          Selection premium
        </div>

        <div className="relative z-10 flex h-full flex-col justify-end gap-5 pt-24">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-primary/80">
              {project.coverPublicId ? "Cloudinary-ready media" : "Generated visual system"}
            </p>
            <h3
              className={[
                "font-display font-semibold leading-tight text-foreground",
                featured ? "text-4xl sm:text-6xl" : "text-3xl sm:text-4xl"
              ].join(" ")}
            >
              {project.title}
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              {project.summary}
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {project.services.map((service) => (
                <Badge key={service} variant="outline">
                  {service}
                </Badge>
              ))}
            </div>
            <span className="inline-flex min-h-11 items-center text-sm font-medium text-primary underline-offset-4 transition-colors group-hover:text-foreground group-hover:underline">
              Voir le projet
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
