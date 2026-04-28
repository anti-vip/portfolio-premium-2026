"use server";

import { revalidatePath } from "next/cache";
import { createVerifiedReview } from "@/lib/reviews";

export type ReviewGateState = {
  status: "idle" | "success" | "error";
  message: string;
};

function isValidToken(token: string) {
  const expectedToken = process.env.REVIEW_GATE_TOKEN;

  return Boolean(expectedToken && token === expectedToken);
}

export async function submitVerifiedReview(
  _previousState: ReviewGateState,
  formData: FormData
): Promise<ReviewGateState> {
  const token = String(formData.get("reviewToken") ?? "");
  const projectName = String(formData.get("projectName") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const ratingStars = Number(formData.get("ratingStars") ?? 5);
  const verifiedClientId = String(
    formData.get("verifiedClientId") ?? ""
  ).trim();

  if (!isValidToken(token)) {
    return {
      status: "error",
      message: "Lien expiré. Demandez une nouvelle porte d'accès."
    };
  }

  if (!projectName || content.length < 24) {
    return {
      status: "error",
      message: "Nom du projet requis. Avis minimum : 24 caractères."
    };
  }

  if (!Number.isInteger(ratingStars) || ratingStars < 1 || ratingStars > 5) {
    return {
      status: "error",
      message: "La note doit rester entre 1 et 5."
    };
  }

  try {
    await createVerifiedReview({
      projectName,
      ratingStars,
      content,
      verifiedClientId: verifiedClientId || null
    });
    revalidatePath("/");

    return {
      status: "success",
      message: "Avis signé. Il est maintenant visible sur ANTIDZN."
    };
  } catch {
    return {
      status: "error",
      message: "Neon refuse l'écriture pour l'instant."
    };
  }
}
