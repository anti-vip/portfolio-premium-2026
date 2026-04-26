export type AccessActionState = {
  status: "idle" | "success" | "error";
  message: string;
  ticketId?: string;
  notificationStatus?: "sent" | "skipped" | "failed";
};
