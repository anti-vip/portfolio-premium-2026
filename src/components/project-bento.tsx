import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/lib/projects";

type ProjectBentoProps = {
  projects: Project[];
};

const gradients = [
  "radial-gradient(circle at 20% 20%, rgba(245,223,178,0.22), transparent 30%), radial-gradient(circle at 80% 20%, rgba(57, 188, 161, 0.18), transparent 28%), linear-gradient(135deg, rgba(255,255,255,0.055), rgba(255,255,255,0.015))",
  "radial-gradient(circle at 70% 25%, rgba(116,132,255,0.22), transparent 32%), radial-gradient(circle at 25% 75%, rgba(245,223,178,0.18), transparent 26%), linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))",
  "radial-gradient(circle at 55% 5%, rgba(57,188,161,0.2), transparent 30%), radial-gradient(circle at 20% 80%, rgba(245,223,178,0.16), transparent 28%), linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.012))"
];

const bentoSlots = [
  "md:col-span-4 md:row-span-2",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-3",
  "md:col-span-3",
  "md:col-span-2"
];

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
              Projets
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-none text-foreground sm:text-6xl">
              Une grille éditoriale, pas une vitrine polie.
            </h2>
          </div>
          <div className="grid w-full max-w-sm grid-cols-3 overflow-hidden rounded-lg border border-white/5 bg-white/[0.035] backdrop-blur-2xl">
            {[
              ["Projets", projects.length.toString()],
              ["Live", liveProjects.toString()],
              ["Axes", totalServices.toString()]
            ].map(([label, value]) => (
              <div key={label} className="border-r border-white/5 p-4 last:border-r-0">
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

        <div className="grid auto-rows-[minmax(260px,auto)] gap-px overflow-hidden rounded-lg border border-white/5 bg-white/5 md:grid-cols-6">
          {projects.map((project, index) => {
            const imageLayer = project.imageUrl
              ? `linear-gradient(180deg, rgba(5,5,7,0.12), rgba(5,5,7,0.82)), url(${project.imageUrl})`
              : gradients[index % gradients.length];

            return (
              <ProjectCard
                key={project.id}
                featured={index === 0}
                imageLayer={imageLayer}
                index={index}
                project={project}
                slotClassName={bentoSlots[index % bentoSlots.length]}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
