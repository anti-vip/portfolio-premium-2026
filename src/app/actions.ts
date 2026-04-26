"use server";

import { createHash, randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { getSql } from "@/lib/db";
import { sendTicketNotification } from "@/lib/sendgrid";

export type AccessActionState = {
  status: "idle" | "success" | "error";
  message: string;
  ticketId?: string;
  notificationStatus?: "sent" | "skipped" | "failed";
};

type AccountRow = {
  id: string;
};

type TicketRow = {
  id: string;
  priority: string;
  created_at: string;
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

  const accountRows = (await sql`
    INSERT INTO client_accounts (email, full_name, company)
    VALUES (${email}, ${name}, ${company || null})
    ON CONFLICT (email) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      company = EXCLUDED.company,
      updated_at = now()
    RETURNING id
  `) as AccountRow[];

  const accountId = accountRows[0]?.id ?? null;

  await sql`
    INSERT INTO account_verifications (email, token_hash, expires_at)
    VALUES (${email}, ${tokenHash}, now() + interval '30 minutes')
  `;

  const priority = budgetRange.includes("100") ? "high" : "normal";
  const ticketRows = (await sql`
    INSERT INTO contact_tickets (
      account_id,
      name,
      email,
      company,
      project_type,
      budget_range,
      message,
      priority
    )
    VALUES (
      ${accountId},
      ${name},
      ${email},
      ${company || null},
      ${projectType},
      ${budgetRange || null},
      ${message},
      ${priority}
    )
    RETURNING id, priority, created_at
  `) as TicketRow[];

  const ticket = ticketRows[0];

  await sql`
    INSERT INTO contact_ticket_events (ticket_id, event_type, metadata)
    VALUES (
      ${ticket.id},
      'ticket_created',
      ${JSON.stringify({ source: "portfolio", priority })}::jsonb
    )
  `;

  const notification = await sendTicketNotification({
    budgetRange,
    company,
    email,
    message,
    name,
    priority: ticket.priority,
    projectType,
    ticketCreatedAt: ticket.created_at,
    ticketId: ticket.id
  });

  await sql`
    INSERT INTO contact_ticket_events (ticket_id, event_type, metadata)
    VALUES (
      ${ticket.id},
      ${notification.status === "sent"
        ? "notification_sent"
        : notification.status === "skipped"
          ? "notification_skipped"
          : "notification_failed"},
      ${JSON.stringify({
        provider: "sendgrid",
        detail: notification.detail ?? null
      })}::jsonb
    )
  `;

  revalidatePath("/");

  return {
    status: "success",
    ticketId: ticket.id,
    notificationStatus: notification.status,
    message:
      notification.status === "sent"
        ? "Ticket cree. Notification envoyee et validation client Neon en attente."
        : "Ticket cree dans Neon. Ajoutez les variables SendGrid sur Vercel pour activer la notification immediate."
  };
}
