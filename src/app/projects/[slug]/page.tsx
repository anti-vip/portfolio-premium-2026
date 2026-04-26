import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectDetailHero } from "@/components/project-detail-hero";
import { SiteNav } from "@/components/site-nav";
import { getFeaturedProjects, getProjectBySlug } from "@/lib/projects";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Projet introuvable"
    };
  }

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article"
    }
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const projects = await getFeaturedProjects();
  const nextProject =
    projects.find((candidate) => candidate.slug !== project.slug) ?? null;
  const imageLayer = project.imageUrl
    ? `linear-gradient(180deg, rgba(5,5,7,0.08), rgba(5,5,7,0.86)), url(${project.imageUrl})`
    : "radial-gradient(circle at 20% 18%, rgba(245,223,178,0.32), transparent 30%), radial-gradient(circle at 82% 8%, rgba(57,188,161,0.24), transparent 30%), linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))";

  return (
    <main className="relative min-h-screen overflow-hidden">
      <SiteNav />
      <ProjectDetailHero project={project} imageLayer={imageLayer} />

      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.76fr_1.24fr]">
          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-lg border border-white/10 bg-white/[0.045] p-5 backdrop-blur-2xl sm:p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-primary">
                Project room
              </p>
              <dl className="mt-6 grid gap-5 text-sm">
                <div>
                  <dt className="text-muted-foreground">Statut</dt>
                  <dd className="mt-1 text-foreground">{project.status}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Priorite</dt>
                  <dd className="mt-1 text-foreground">
                    Experience, conversion et retention client
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Media</dt>
                  <dd className="mt-1 text-foreground">
                    Cloudinary f_auto, q_auto
                  </dd>
                </div>
              </dl>
            </div>

            <Link
              href="/#contact"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-border bg-white/[0.04] px-5 text-sm font-semibold text-foreground backdrop-blur-xl transition-colors hover:bg-white/[0.08]"
            >
              Ouvrir un ticket projet
            </Link>
          </aside>

          <article className="space-y-12">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["01", "Direction", "Signature visuelle stricte et memorable."],
                ["02", "Systeme", "Composants reactifs, data Neon et media Cloudinary."],
                ["03", "Motion", "Transitions douces, micro-interactions et scroll fluide."]
              ].map(([step, title, copy]) => (
                <div
                  key={step}
                  className="rounded-lg border border-white/10 bg-card/70 p-5 backdrop-blur-xl sm:p-6"
                >
                  <p className="font-display text-3xl text-primary">{step}</p>
                  <h2 className="mt-5 font-display text-2xl font-semibold">
                    {title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {copy}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-7">
              <p className="text-sm uppercase tracking-[0.24em] text-primary">
                Editorial build
              </p>
              <h2 className="font-display text-4xl font-semibold leading-none sm:text-6xl">
                Une experience digitale qui garde la tension du luxe tout en
                restant rapide et administrable.
              </h2>
              <div className="grid gap-6 text-base leading-8 text-muted-foreground md:grid-cols-2">
                <p>
                  Le projet est pense comme une piece editoriale: une entree
                  forte, une narration courte, des preuves visibles et un chemin
                  direct vers la conversion. Les images sont servies via
                  Cloudinary avec transformations automatiques pour garder un
                  rendu net sans alourdir la page.
                </p>
                <p>
                  Cote systeme, Neon garde les demandes, les statuts et les
                  sessions client. Le front reste minimal, mais chaque action
                  utile est connectee: brief, dashboard, notifications et suivi
                  prive.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {project.services.map((service) => (
                <span
                  key={service}
                  className="inline-flex min-h-8 items-center rounded-md border border-border px-2.5 py-1 text-xs font-medium text-foreground"
                >
                  {service}
                </span>
              ))}
            </div>

            {nextProject ? (
              <Link
                href={`/projects/${nextProject.slug}`}
                className="group block rounded-lg border border-white/10 bg-white/[0.045] p-5 transition-colors hover:border-primary/30 sm:p-6"
              >
                <p className="text-sm uppercase tracking-[0.22em] text-primary">
                  Projet suivant
                </p>
                <div className="mt-4 flex min-h-11 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <h2 className="font-display text-3xl font-semibold sm:text-4xl">
                    {nextProject.title}
                  </h2>
                  <span className="inline-flex min-h-11 items-center text-sm font-medium text-primary group-hover:underline">
                    Ouvrir le projet
                  </span>
                </div>
              </Link>
            ) : null}
          </article>
        </div>
      </section>
    </main>
  );
}
