import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ReviewGateForm } from "@/components/review-gate-form";
import { Button } from "@/components/ui/button";

type ReviewGatePageProps = {
  searchParams?: Promise<{
    token?: string;
  }>;
};

export default async function ReviewGatePage({
  searchParams
}: ReviewGatePageProps) {
  const params = await searchParams;
  const token = params?.token ?? "";
  const expectedToken = process.env.REVIEW_GATE_TOKEN;
  const isUnlocked = Boolean(expectedToken && token === expectedToken);

  return (
    <main className="min-h-screen px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto mb-10 max-w-2xl">
        <Button asChild variant="ghost">
          <Link href="/">
            <ArrowLeft aria-hidden="true" className="size-4" />
            Retour
          </Link>
        </Button>
        <p className="mt-10 text-sm uppercase tracking-[0.24em] text-primary">
          Review gate
        </p>
        <h1 className="mt-4 font-display text-5xl font-semibold leading-none text-foreground sm:text-7xl">
          Avis client certifié.
        </h1>
        <p className="mt-5 text-sm leading-6 text-muted-foreground">
          Accès réservé aux projets livrés. Un token. Un avis. Une trace.
        </p>
      </div>

      {isUnlocked ? (
        <ReviewGateForm token={token} />
      ) : (
        <div className="mx-auto max-w-2xl rounded-lg border border-white/5 bg-white/[0.035] p-6 text-sm text-muted-foreground">
          Porte fermée. Ajoutez un token valide dans l&apos;URL.
        </div>
      )}
    </main>
  );
}
