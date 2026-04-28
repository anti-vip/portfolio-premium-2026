import { getSql } from "@/lib/db";

type SqlClient = NonNullable<ReturnType<typeof getSql>>;

export type Review = {
  id: string;
  projectName: string;
  ratingStars: number;
  content: string;
  verifiedClientId: string | null;
  createdAt: string | null;
};

type ReviewRow = {
  id: string;
  project_name: string;
  rating_stars: number;
  content: string;
  verified_client_id: string | null;
  created_at: string | Date | null;
};

export type CreateReviewInput = {
  projectName: string;
  ratingStars: number;
  content: string;
  verifiedClientId?: string | null;
};

const seedReviews: CreateReviewInput[] = [
  {
    projectName: "Atelier Nova",
    ratingStars: 5,
    content:
      "Direction nette, assets propres, livraison sans bruit. Le serveur a enfin une identité qui tient debout.",
    verifiedClientId: "00000000-0000-4000-8000-000000000001"
  },
  {
    projectName: "Solstice",
    ratingStars: 5,
    content:
      "La 3D a donné le ton. Pas d'effet gratuit, juste une image froide et mémorisable.",
    verifiedClientId: "00000000-0000-4000-8000-000000000002"
  },
  {
    projectName: "Aurora",
    ratingStars: 5,
    content:
      "Le branding Discord est devenu premium sans perdre la tension communautaire. Rare.",
    verifiedClientId: "00000000-0000-4000-8000-000000000003"
  },
  {
    projectName: "Maison Cobalt",
    ratingStars: 5,
    content:
      "Brief cadré, rendu C4D précis, fichiers exploitables dès la première passe.",
    verifiedClientId: "00000000-0000-4000-8000-000000000004"
  }
];

function normalizeCreatedAt(value: string | Date | null) {
  if (!value) {
    return null;
  }

  return value instanceof Date ? value.toISOString() : value;
}

function mapReview(row: ReviewRow): Review {
  return {
    id: row.id,
    projectName: row.project_name,
    ratingStars: row.rating_stars,
    content: row.content,
    verifiedClientId: row.verified_client_id,
    createdAt: normalizeCreatedAt(row.created_at)
  };
}

async function ensureReviewsSchema(sql: SqlClient) {
  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      project_name text NOT NULL,
      rating_stars integer NOT NULL CHECK (rating_stars BETWEEN 1 AND 5),
      content text NOT NULL,
      verified_client_id uuid,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS reviews_created_at_idx
    ON reviews (created_at DESC)
  `;
}

async function insertSeedReviews(sql: SqlClient) {
  for (const review of seedReviews) {
    await sql`
      INSERT INTO reviews (
        project_name,
        rating_stars,
        content,
        verified_client_id
      )
      SELECT
        ${review.projectName},
        ${review.ratingStars},
        ${review.content},
        ${review.verifiedClientId}
      WHERE NOT EXISTS (
        SELECT 1 FROM reviews WHERE project_name = ${review.projectName}
      )
    `;
  }
}

export function getFallbackReviews(): Review[] {
  return seedReviews.map((review, index) => ({
    id: `fallback-review-${index + 1}`,
    projectName: review.projectName,
    ratingStars: review.ratingStars,
    content: review.content,
    verifiedClientId: review.verifiedClientId ?? null,
    createdAt: null
  }));
}

export async function getVerifiedReviews(): Promise<Review[]> {
  const sql = getSql();

  if (!sql) {
    return getFallbackReviews();
  }

  try {
    await ensureReviewsSchema(sql);
    await insertSeedReviews(sql);

    const rows = (await sql`
      SELECT
        id,
        project_name,
        rating_stars,
        content,
        verified_client_id,
        created_at
      FROM reviews
      ORDER BY created_at DESC
      LIMIT 16
    `) as ReviewRow[];

    return rows.length ? rows.map(mapReview) : getFallbackReviews();
  } catch {
    return getFallbackReviews();
  }
}

export async function createVerifiedReview(input: CreateReviewInput) {
  const sql = getSql();

  if (!sql) {
    throw new Error("DATABASE_URL missing");
  }

  await ensureReviewsSchema(sql);

  const rows = (await sql`
    INSERT INTO reviews (
      project_name,
      rating_stars,
      content,
      verified_client_id
    )
    VALUES (
      ${input.projectName},
      ${input.ratingStars},
      ${input.content},
      ${input.verifiedClientId ?? null}
    )
    RETURNING
      id,
      project_name,
      rating_stars,
      content,
      verified_client_id,
      created_at
  `) as ReviewRow[];

  return rows[0] ? mapReview(rows[0]) : null;
}
