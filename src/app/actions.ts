"use server";

import { createHash, randomBytes, randomInt } from "crypto";
import { revalidatePath } from "next/cache";
import { getSql } from "@/lib/db";
import {
  sendAccessCodeEmail,
  sendTicketNotification
} from "@/lib/sendgrid";

export type AccessActionState = {
  status: "idle" | "success" | "error";
  message: string;
  ticketId?: string;
  notificationStatus?: "sent" | "skipped" | "failed";
};

export type TicketSummary = {
  id: string;
  createdAt: string;
  priority: string;
  projectType: string;
  status: string;
};

export type ClientAuthState = {
  status: "idle" | "success" | "error";
  step: "request" | "verify" | "authenticated";
  message: string;
  email?: string;
  tickets?: TicketSummary[];
};

type AccountRow = {
  id: string;
};

type TicketRow = {
  id: string;
  priority: string;
  created_at: string | Date;
};

type TicketSummaryRow = {
  id: string;
  created_at: string | Date;
  priority: string | null;
  project_type: string | null;
  status: string | null;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function hashToken(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function normalizeCreatedAt(value: string | Date) {
  return value instanceof Date ? value.toISOString() : value;
}

async function getTicketSummaries(accountId: string): Promise<TicketSummary[]> {
  const sql = getSql();

  if (!sql) {
    return [];
  }

  const rows = (await sql`
    SELECT
      id,
      status,
      priority,
      project_type,
      created_at
    FROM contact_tickets
    WHERE account_id = ${accountId}
    ORDER BY created_at DESC
    LIMIT 12
  `) as TicketSummaryRow[];

  return rows.map((ticket) => ({
    id: ticket.id,
    createdAt: normalizeCreatedAt(ticket.created_at),
    priority: ticket.priority ?? "normal",
    projectType: ticket.project_type ?? "Projet premium",
    status: ticket.status ?? "new"
  }));
}

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
  const tokenHash = hashToken(verificationToken);

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

  if (!ticket) {
    return {
      status: "error",
      message: "Impossible de creer le ticket Neon. Reessayez dans un instant."
    };
  }

  const ticketCreatedAt = normalizeCreatedAt(ticket.created_at);

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
    ticketCreatedAt,
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

export async function requestClientLoginCode(
  _previousState: ClientAuthState,
  formData: FormData
): Promise<ClientAuthState> {
  const email = String(formData.get("portalEmail") ?? "").trim().toLowerCase();

  if (!emailPattern.test(email)) {
    return {
      status: "error",
      step: "request",
      message: "Entrez un email client valide."
    };
  }

  const sql = getSql();

  if (!sql) {
    return {
      status: "error",
      step: "request",
      message: "DATABASE_URL doit etre configure sur Vercel pour activer l'espace client.",
      email
    };
  }

  const accountRows = (await sql`
    SELECT id
    FROM client_accounts
    WHERE email = ${email}
    LIMIT 1
  `) as AccountRow[];

  if (!accountRows[0]?.id) {
    return {
      status: "error",
      step: "request",
      message: "Compte client introuvable. Creez un ticket avant de vous connecter.",
      email
    };
  }

  const code = randomInt(100000, 1000000).toString();
  const tokenHash = hashToken(code);

  await sql`
    INSERT INTO account_verifications (email, token_hash, expires_at)
    VALUES (${email}, ${tokenHash}, now() + interval '15 minutes')
  `;

  const delivery = await sendAccessCodeEmail({ code, email });

  return {
    status: delivery.status === "failed" ? "error" : "success",
    step: "verify",
    email,
    message:
      delivery.status === "sent"
        ? "Code envoye. Consultez votre boite email pour ouvrir le dashboard."
        : delivery.status === "skipped"
          ? "Code cree dans Neon. Configurez SendGrid pour l'envoi email automatique."
          : "Le code a ete cree, mais SendGrid n'a pas pu envoyer l'email."
  };
}

export async function verifyClientLoginCode(
  _previousState: ClientAuthState,
  formData: FormData
): Promise<ClientAuthState> {
  const email = String(formData.get("portalEmail") ?? "").trim().toLowerCase();
  const code = String(formData.get("portalCode") ?? "").trim();

  if (!emailPattern.test(email) || !/^\d{6}$/.test(code)) {
    return {
      status: "error",
      step: "verify",
      email,
      message: "Saisissez l'email et le code a 6 chiffres."
    };
  }

  const sql = getSql();

  if (!sql) {
    return {
      status: "error",
      step: "verify",
      email,
      message: "DATABASE_URL doit etre configure sur Vercel pour verifier l'acces."
    };
  }

  const rows = (await sql`
    SELECT ca.id
    FROM account_verifications av
    INNER JOIN client_accounts ca ON ca.email = av.email
    WHERE av.email = ${email}
      AND av.token_hash = ${hashToken(code)}
      AND av.expires_at > now()
    ORDER BY av.expires_at DESC
    LIMIT 1
  `) as AccountRow[];

  const accountId = rows[0]?.id;

  if (!accountId) {
    return {
      status: "error",
      step: "verify",
      email,
      message: "Code invalide ou expire. Demandez un nouveau code."
    };
  }

  await sql`
    DELETE FROM account_verifications
    WHERE email = ${email}
      AND token_hash = ${hashToken(code)}
  `;

  const tickets = await getTicketSummaries(accountId);

  return {
    status: "success",
    step: "authenticated",
    email,
    tickets,
    message: tickets.length
      ? "Acces valide. Vos tickets sont synchronises depuis Neon."
      : "Acces valide. Aucun ticket rattache a ce compte pour le moment."
  };
}
