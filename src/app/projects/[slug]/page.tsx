import Link from "next/link";

import { SiteNav } from "@/components/site-nav";

type ProjectPageProps = {
  params: {
    slug: string;
  };
};

export default function ProjectPage({ params }: ProjectPageProps) {
  const title = params.slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return (
    <main className="relative min-h-screen overflow-hidden px-5 py-28 sm:px-8 lg:px-10">
      <SiteNav />
      <section className="mx-auto flex min-h-[70svh] max-w-6xl flex-col justify-end">
        <Link
          href="/#projects"
          className="inline-flex min-h-11 w-fit items-center justify-center rounded-full border border-border bg-white/[0.04] px-5 text-sm font-semibold text-foreground backdrop-blur-xl transition-colors hover:bg-white/[0.08]"
        >
          Retour aux projets
        </Link>
        <p className="mt-16 text-sm uppercase tracking-[0.24em] text-primary">
          Case study
        </p>
        <h1 className="mt-5 max-w-5xl font-display text-[clamp(3.25rem,13vw,9.2rem)] font-semibold leading-[0.86] tracking-normal text-foreground">
          {title}
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Page projet dynamique prete pour la narration editoriale, les medias
          Cloudinary et les donnees Neon.
        </p>
      </section>
    </main>
  );
}
