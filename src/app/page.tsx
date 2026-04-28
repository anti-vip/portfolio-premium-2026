import { ClientAccess } from "@/components/client-access";
import { ClientMarquee } from "@/components/client-marquee";
import { HeroSection } from "@/components/hero-section";
import { ProjectBento } from "@/components/project-bento";
import { ReviewsMarquee } from "@/components/reviews-marquee";
import { SiteNav } from "@/components/site-nav";
import { WorkflowSection } from "@/components/workflow-section";
import { getFeaturedProjects } from "@/lib/projects";

export const revalidate = 60;

export default async function Home() {
  const projects = await getFeaturedProjects();

  return (
    <main className="relative min-h-screen overflow-hidden">
      <SiteNav />
      <HeroSection />
      <ProjectBento projects={projects} />
      <WorkflowSection />
      <ReviewsMarquee />
      <ClientAccess />
      <ClientMarquee />
      <footer className="px-5 pb-10 pt-2 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl border-t border-white/5 pt-6 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
          © 2026 ANTIDZN — DISPONIBILITÉ LIMITÉE.
        </div>
      </footer>
    </main>
  );
}
