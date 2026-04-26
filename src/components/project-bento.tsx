import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/projects";

type ProjectBentoProps = {
  projects: Project[];
};

const gradients = [
  "radial-gradient(circle at 20% 20%, rgba(245,223,178,0.34), transparent 30%), radial-gradient(circle at 80% 20%, rgba(57, 188, 161, 0.28), transparent 28%), linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
  "radial-gradient(circle at 70% 25%, rgba(116,132,255,0.34), transparent 32%), radial-gradient(circle at 25% 75%, rgba(245,223,178,0.24), transparent 26%), linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
  "radial-gradient(circle at 55% 5%, rgba(57,188,161,0.32), transparent 30%), radial-gradient(circle at 20% 80%, rgba(245,223,178,0.2), transparent 28%), linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.015))"
];

const bentoSlots = [
  "md:col-span-4 md:row-span-2",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-3",
  "md:col-span-3",
  "md:col-span-2"
];

const statusLabels: Record<string, string> = {
  live: "Live",
  prototype: "Prototype",
  concept: "Concept"
};

function formatProjectStatus(status: string) {
  return statusLabels[status.toLowerCase()] ?? status;
}

export function ProjectBento({ projects }: ProjectBentoProps) {
  const liveProjects = projects.filter(
    (project) => project.status.toLowerCase() === "live"
  ).length;
  const totalServices = new Set(projects.flatMap((project) => project.services)).size;

  return (
    <section id="projects" className="relative px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.24em] text-primary">
              Projets dynamiques
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-none text-foreground sm:text-6xl">
              Bento grid asymetrique pour signatures digitales.
            </h2>
          </div>
          <div className="grid w-full max-w-sm grid-cols-3 overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] backdrop-blur-2xl">
            {[
              ["Projets", projects.length.toString()],
              ["Live", liveProjects.toString()],
              ["Services", totalServices.toString()]
            ].map(([label, value]) => (
              <div key={label} className="border-r border-white/10 p-4 last:border-r-0">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {label}
                </p>
                <p className="mt-2 font-display text-3xl font-semibold text-foreground">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid auto-rows-[minmax(260px,auto)] gap-4 md:grid-cols-6">
          {projects.map((project, index) => {
            const featured = index === 0;
            const imageLayer = project.imageUrl
              ? `linear-gradient(180deg, rgba(5,5,7,0.12), rgba(5,5,7,0.82)), url(${project.imageUrl})`
              : gradients[index % gradients.length];

            return (
              <article
                key={project.id}
                className={[
                  "group relative overflow-hidden rounded-lg border border-white/10 bg-card p-5 shadow-[0_24px_90px_rgba(0,0,0,0.28)]",
                  "transition-transform duration-500 hover:-translate-y-1",
                  bentoSlots[index % bentoSlots.length]
                ].join(" ")}
                style={{
                  backgroundImage: imageLayer,
                  backgroundPosition: "center",
                  backgroundSize: "cover"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-[0.88]" />
                <div className="absolute inset-x-5 top-5 flex items-center justify-between">
                  <Badge>{formatProjectStatus(project.status)}</Badge>
                  <span className="font-display text-sm text-primary/80">
                    0{index + 1}
                  </span>
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
                    <a
                      href={`#contact`}
                      className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-foreground hover:underline"
                    >
                      Qualifier ce type de projet
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
