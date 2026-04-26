import { ClientAccess } from "@/components/client-access";
import { HeroSection } from "@/components/hero-section";
import { ProjectBento } from "@/components/project-bento";
import { SiteNav } from "@/components/site-nav";
import { getFeaturedProjects } from "@/lib/projects";

export const revalidate = 60;

export default async function Home() {
  const projects = await getFeaturedProjects();

  return (
    <main className="relative min-h-screen overflow-hidden">
      <SiteNav />
      <HeroSection />
      <ProjectBento projects={projects} />
      <ClientAccess />
    </main>
  );
}
