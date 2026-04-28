import { Badge } from "@/components/ui/badge";
import { getVerifiedReviews, type Review } from "@/lib/reviews";

function ReviewCard({ review }: { review: Review }) {
  const filledStars = "★".repeat(review.ratingStars);
  const emptyStars = "★".repeat(Math.max(0, 5 - review.ratingStars));

  return (
    <article className="mx-2 flex h-full w-[320px] shrink-0 flex-col justify-between rounded-lg border border-white/5 bg-white/[0.035] p-5 backdrop-blur-xl sm:w-[420px]">
      <div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-display text-2xl font-semibold text-foreground">
              {review.projectName}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              avis certifié
            </p>
          </div>
          <Badge variant="outline">✓ Client Vérifié</Badge>
        </div>

        <p className="mt-6 text-base leading-7 text-foreground/90">
          {review.content}
        </p>
      </div>

      <div
        aria-label={`${review.ratingStars} sur 5`}
        className="mt-6 text-sm tracking-[0.2em]"
      >
        <span className="text-primary">{filledStars}</span>
        <span className="text-white/10">{emptyStars}</span>
      </div>
    </article>
  );
}

export async function ReviewsMarquee() {
  const reviews = await getVerifiedReviews();
  const marqueeReviews = [...reviews, ...reviews];

  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto mb-10 flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-primary">
            Avis dynamiques
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-none text-foreground sm:text-6xl">
            Clients vérifiés. Pas de poudre.
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-muted-foreground">
          Des retours courts. Des projets livrés. Rien à vendre en trop.
        </p>
      </div>

      <div
        aria-label="Avis clients certifiés"
        className="relative -mx-5 overflow-hidden sm:-mx-8 lg:-mx-10"
      >
        <div className="reviews-marquee-track flex w-max py-1">
          {marqueeReviews.map((review, index) => (
            <ReviewCard key={`${review.id}-${index}`} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
