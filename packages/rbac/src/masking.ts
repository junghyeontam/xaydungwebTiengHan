/**
 * PII (Personally Identifiable Information) Masking Utilities
 * Protects learner privacy in non-privileged admin views.
 */

export function maskEmail(email: string | null | undefined): string {
  if (!email || typeof email !== "string") return "—";
  const parts = email.trim().split("@");
  if (parts.length !== 2) return "***@***.***";
  const [username, domain] = parts;
  if (username.length <= 2) {
    return `${username.charAt(0)}***@${domain}`;
  }
  const visible = username.slice(0, 2);
  return `${visible}***@${domain}`;
}

export function maskPhone(phone: string | null | undefined): string {
  if (!phone || typeof phone !== "string") return "—";
  const cleaned = phone.replace(/\s+/g, "");
  if (cleaned.length < 7) return "*** *** ***";
  const start = cleaned.slice(0, 4);
  const end = cleaned.slice(-3);
  return `${start} *** ${end}`;
}

export function maskName(fullName: string | null | undefined): string {
  if (!fullName || typeof fullName !== "string") return "—";
  const words = fullName.trim().split(/\s+/);
  if (words.length <= 1) {
    const word = words[0];
    return word.length > 2 ? `${word.slice(0, 2)}***` : `${word}***`;
  }
  // Keep first word intact, mask intermediate and last words
  return words
    .map((word, idx) => {
      if (idx === 0) return word;
      return `${word.charAt(0)}**`;
    })
    .join(" ");
}

export function maskLearnerRecord<T extends { email?: string; phone?: string; fullName?: string; name?: string }>(
  record: T,
  canViewPii: boolean
): T {
  if (canViewPii) return record;

  return {
    ...record,
    email: record.email ? maskEmail(record.email) : undefined,
    phone: record.phone ? maskPhone(record.phone) : undefined,
    fullName: record.fullName ? maskName(record.fullName) : undefined,
    name: record.name ? maskName(record.name) : undefined,
  };
}
