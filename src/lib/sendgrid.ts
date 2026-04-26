type TicketNotificationInput = {
  budgetRange: string;
  company: string;
  email: string;
  message: string;
  name: string;
  priority: string;
  projectType: string;
  ticketCreatedAt: string;
  ticketId: string;
};

type TicketNotificationResult = {
  status: "sent" | "skipped" | "failed";
  detail?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function ticketText(input: TicketNotificationInput) {
  return [
    "Nouveau ticket Portfolio Premium 2026",
    "",
    `Ticket: ${input.ticketId}`,
    `Priorite: ${input.priority}`,
    `Date: ${input.ticketCreatedAt}`,
    "",
    `Nom: ${input.name}`,
    `Email: ${input.email}`,
    `Maison / Societe: ${input.company || "Non renseigne"}`,
    `Type de projet: ${input.projectType}`,
    `Budget: ${input.budgetRange || "Non renseigne"}`,
    "",
    "Brief:",
    input.message
  ].join("\n");
}

function ticketHtml(input: TicketNotificationInput) {
  const rows = [
    ["Ticket", input.ticketId],
    ["Priorite", input.priority],
    ["Date", input.ticketCreatedAt],
    ["Nom", input.name],
    ["Email", input.email],
    ["Maison / Societe", input.company || "Non renseigne"],
    ["Type de projet", input.projectType],
    ["Budget", input.budgetRange || "Non renseigne"]
  ];

  return `
    <div style="background:#050507;color:#f7f2ea;font-family:Inter,Arial,sans-serif;padding:32px">
      <div style="max-width:640px;margin:0 auto;border:1px solid rgba(255,255,255,.14);border-radius:14px;background:#0c0d12;padding:28px">
        <p style="margin:0 0 10px;color:#f5dfb2;letter-spacing:.18em;text-transform:uppercase;font-size:12px">Portfolio Premium 2026</p>
        <h1 style="margin:0 0 24px;font-size:28px;line-height:1.08">Nouveau ticket client</h1>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
          ${rows
            .map(
              ([label, value]) => `
                <tr>
                  <td style="border-top:1px solid rgba(255,255,255,.1);padding:12px 0;color:#a7a29a;font-size:13px">${escapeHtml(label)}</td>
                  <td style="border-top:1px solid rgba(255,255,255,.1);padding:12px 0;text-align:right;font-size:13px">${escapeHtml(value)}</td>
                </tr>
              `
            )
            .join("")}
        </table>
        <div style="border:1px solid rgba(245,223,178,.22);border-radius:12px;background:rgba(245,223,178,.06);padding:18px">
          <p style="margin:0 0 8px;color:#f5dfb2;font-size:12px;letter-spacing:.16em;text-transform:uppercase">Brief</p>
          <p style="margin:0;white-space:pre-line;color:#f7f2ea;line-height:1.6">${escapeHtml(input.message)}</p>
        </div>
      </div>
    </div>
  `;
}

export async function sendTicketNotification(
  input: TicketNotificationInput
): Promise<TicketNotificationResult> {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL;
  const fromName = process.env.SENDGRID_FROM_NAME ?? "Portfolio Premium 2026";
  const toEmail =
    process.env.CONTACT_NOTIFICATION_EMAIL ?? process.env.SENDGRID_TO_EMAIL;

  if (!apiKey || !fromEmail || !toEmail) {
    return {
      status: "skipped",
      detail: "Missing SENDGRID_API_KEY, SENDGRID_FROM_EMAIL or CONTACT_NOTIFICATION_EMAIL"
    };
  }

  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: toEmail }],
            subject: `Nouveau ticket premium: ${input.projectType}`
          }
        ],
        from: {
          email: fromEmail,
          name: fromName
        },
        reply_to: {
          email: input.email,
          name: input.name
        },
        content: [
          {
            type: "text/plain",
            value: ticketText(input)
          },
          {
            type: "text/html",
            value: ticketHtml(input)
          }
        ]
      })
    });

    if (!response.ok) {
      return {
        status: "failed",
        detail: `SendGrid responded with ${response.status}`
      };
    }

    return { status: "sent" };
  } catch (error) {
    return {
      status: "failed",
      detail: error instanceof Error ? error.message : "Unknown SendGrid error"
    };
  }
}
