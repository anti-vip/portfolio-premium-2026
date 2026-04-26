import { cloudinaryImageUrl } from "@/lib/cloudinary";
import { getSql } from "@/lib/db";

export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  services: string[];
  status: string;
  featured: boolean;
  sortOrder: number;
  publishedAt: string | null;
  coverPublicId: string | null;
  imageUrl: string | null;
};

const projectImageOptions = {
  width: 1600,
  height: 1000,
  crop: "fill" as const
};

const fallbackProjects: Project[] = [
  {
    id: "maison-aurora",
    slug: "maison-aurora",
    title: "Maison Aurora",
    summary:
      "Experience e-commerce couture avec direction artistique, micro-interactions et tunnel client sans friction.",
    services: ["Art direction", "Next.js", "3D motion"],
    status: "Live",
    featured: true,
    sortOrder: 1,
    publishedAt: null,
    coverPublicId: "portfolio-premium-2026/projects/maison-aurora",
    imageUrl: null
  },
  {
    id: "atelier-nova",
    slug: "atelier-nova",
    title: "Atelier Nova",
    summary:
      "Identite digitale pour un studio interieur, entre catalogue editorial et espace prive client.",
    services: ["Brand system", "Client portal", "Cloudinary"],
    status: "Live",
    featured: true,
    sortOrder: 2,
    publishedAt: null,
    coverPublicId: "portfolio-premium-2026/projects/atelier-nova",
    imageUrl: null
  },
  {
    id: "solstice-private",
    slug: "solstice-private",
    title: "Solstice Private",
    summary:
      "Dashboard confidentiel pour qualifier les demandes, prioriser les tickets et piloter la relation premium.",
    services: ["Neon Postgres", "Automation", "UX system"],
    status: "Prototype",
    featured: true,
    sortOrder: 3,
    publishedAt: null,
    coverPublicId: "portfolio-premium-2026/projects/solstice-private",
    imageUrl: null
  }
];

type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  services: string[];
  status: string;
  featured: boolean;
  sort_order: number;
  published_at: string | null;
  cover_public_id: string | null;
};

function mapProject(project: ProjectRow): Project {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    services: project.services ?? [],
    status: project.status,
    featured: project.featured,
    sortOrder: project.sort_order,
    publishedAt: project.published_at,
    coverPublicId: project.cover_public_id,
    imageUrl: cloudinaryImageUrl(project.cover_public_id, projectImageOptions)
  };
}

function mapFallbackProject(project: Project): Project {
  return {
    ...project,
    imageUrl: cloudinaryImageUrl(project.coverPublicId, projectImageOptions)
  };
}

function getFallbackProjects() {
  return fallbackProjects.map(mapFallbackProject);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const sql = getSql();

  if (!sql) {
    return getFallbackProjects();
  }

  try {
    const rows = (await sql`
      SELECT
        id,
        slug,
        title,
        summary,
        services,
        status,
        featured,
        sort_order,
        published_at,
        cover_public_id
      FROM projects
      WHERE featured = true
      ORDER BY sort_order ASC, published_at DESC NULLS LAST
      LIMIT 6
    `) as ProjectRow[];

    if (!rows.length) {
      return getFallbackProjects();
    }

    return rows.map(mapProject);
  } catch {
    return getFallbackProjects();
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const sql = getSql();

  if (!sql) {
    return getFallbackProjects().find((project) => project.slug === slug) ?? null;
  }

  try {
    const rows = (await sql`
      SELECT
        id,
        slug,
        title,
        summary,
        services,
        status,
        featured,
        sort_order,
        published_at,
        cover_public_id
      FROM projects
      WHERE slug = ${slug}
      LIMIT 1
    `) as ProjectRow[];

    return rows[0] ? mapProject(rows[0]) : null;
  } catch {
    return getFallbackProjects().find((project) => project.slug === slug) ?? null;
  }
}

export async function getProjectSlugs(): Promise<string[]> {
  const sql = getSql();

  if (!sql) {
    return fallbackProjects.map((project) => project.slug);
  }

  try {
    const rows = (await sql`
      SELECT slug
      FROM projects
      ORDER BY sort_order ASC, published_at DESC NULLS LAST
    `) as Pick<ProjectRow, "slug">[];

    return rows.length
      ? rows.map((project) => project.slug)
      : fallbackProjects.map((project) => project.slug);
  } catch {
    return fallbackProjects.map((project) => project.slug);
  }
}
