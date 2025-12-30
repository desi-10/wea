export const normalizePhone = (phone: string) => {
  const p = phone.replace(/\D/g, "");

  // +233XXXXXXXXX → 0XXXXXXXXX
  if (p.startsWith("233") && p.length === 12) {
    return "0" + p.slice(3);
  }

  // 233XXXXXXXXX → 0XXXXXXXXX
  if (p.startsWith("233") && p.length === 12) {
    return "0" + p.slice(3);
  }

  // Already local (0XXXXXXXXX)
  if (p.startsWith("0") && p.length === 10) {
    return p;
  }

  return p; // fallback (still sanitized)
};

/* =======================
   Sanitization helpers
======================= */

export const sanitizeText = (v: string, max = 255) =>
  v.replace(/[<>]/g, "").trim().slice(0, max);

export const sanitizeEmail = (v: string) =>
  v
    .trim()
    .toLowerCase()
    .replace(/[^\w@.+-]/g, "")
    .slice(0, 150);

export const sanitizePhone = (v: string) =>
  v.replace(/[^\d+]/g, "").slice(0, 20);

export const sanitizeSMS = (v: string, max = 90) =>
  v.replace(/[<>]/g, "").slice(0, max);
