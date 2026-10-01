import type { Locale } from "@/lib/content";

const labels: Record<string, Record<Locale, string>> = {
  submitted: { es: "Enviado", en: "Submitted" },
  reviewing: { es: "En revisión", en: "In review" },
  quoted: { es: "Con propuesta", en: "Proposal sent" },
  approved: { es: "Aprobado", en: "Approved" },
  active: { es: "En curso", en: "Active" },
  closed: { es: "Cerrado", en: "Closed" },
  sent: { es: "Enviada", en: "Sent" },
  client_approved: { es: "Aprobada", en: "Approved" },
  declined: { es: "Rechazada", en: "Declined" },
  withdrawn: { es: "Retirada", en: "Withdrawn" },
  superseded: { es: "Reemplazada", en: "Replaced" },
  pending: { es: "Pendiente", en: "Pending" },
  done: { es: "Terminado", en: "Done" },
  on_hold: { es: "En pausa", en: "On hold" },
  completed: { es: "Terminado", en: "Completed" },
  cancelled: { es: "Cancelado", en: "Cancelled" },
  invited: { es: "Invitado", en: "Invited" },
  pending_review: { es: "En revisión", en: "Pending review" },
  rejected: { es: "Rechazado", en: "Rejected" },
};

export function statusLabel(status: string, locale: Locale) {
  return labels[status]?.[locale] || status.replaceAll("_", " ");
}

export function notificationLabel(type: string, title: string, locale: Locale) {
  if (locale === "en") return title;
  if (type === "new_enquiry")
    return "Nuevo pedido: " + title.split(": ").slice(1).join(": ");
  const spanish: Record<string, string> = {
    message: "Nuevo mensaje sobre tu proyecto",
    quote: "Tu propuesta está lista",
    assignment: "Tenés una nueva asignación",
    quote_decision: "El cliente respondió a una propuesta",
    project_start: "Tu proyecto comenzó",
    developer_review: "Hay novedades sobre tu solicitud de desarrollador",
    milestone: "Se actualizó un hito de tu proyecto",
  };
  return spanish[type] || title;
}
