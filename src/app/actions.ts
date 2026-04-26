"use server";

import { createHash, randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { getSql } from "@/lib/db";

export type AccessActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function requestClientAccess(
  _previousState: AccessActionState,
  formData: FormData
): Promise<AccessActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const company = String(formData.get("company") ?? "").trim();
  const projectType = String(formData.get("projectType") ?? "").trim();
  const budgetRange = String(formData.get("budgetRange") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !emailPattern.test(email) || !projectType || message.length < 16) {
    return {
      status: "error",
      message: "Completez le brief avec un email valide et au moins 16 caracteres."
    };
  }

  const sql = getSql();

  if (!sql) {
    return {
      status: "error",
      message: "Neon est pret, mais DATABASE_URL doit etre ajoute sur Vercel pour activer les tickets."
    };
  }

  const verificationToken = randomBytes(24).toString("hex");
  const tokenHash = createHash("sha256").update(verificationToken).digest("hex");

  await sql`
    INSERT INTO client_accounts (email, full_name, company)
    VALUES (${email}, ${name}, ${company || null})
    ON CONFLICT (email) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      company = EXCLUDED.company,
      updated_at = now()
  `;

  await sql`
    INSERT INTO account_verifications (email, token_hash, expires_at)
    VALUES (${email}, ${tokenHash}, now() + interval '30 minutes')
  `;

  await sql`
    INSERT INTO contact_tickets (
      name,
      email,
      company,
      project_type,
      budget_range,
      message,
      priority
    )
    VALUES (
      ${name},
      ${email},
      ${company || null},
      ${projectType},
      ${budgetRange || null},
      ${message},
      ${budgetRange.includes("100") ? "high" : "normal"}
    )
  `;

  revalidatePath("/");

  return {
    status: "success",
    message: "Ticket cree. Une validation client Neon est en attente pour securiser le suivi."
  };
}
