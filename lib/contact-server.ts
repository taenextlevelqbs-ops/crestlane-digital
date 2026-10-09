import { randomUUID } from "node:crypto";
import { validateInquiry } from "./contact-fields";

const MAX_BYTES = 16_384;
export function createLimiter(limit = 20, windowMs = 60_000) {
  let start = 0;
  let count = 0;
  return () => {
    const now = Date.now();
    if (now - start >= windowMs) { start = now; count = 0; }
    return ++count <= limit;
  };
}

const reply = (body: object, status: number, headers: Record<string, string> = {}) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

// Dependencies are injected for deterministic tests; never mock delivery in the live route.
export function createContactHandler(options: {
  env: NodeJS.ProcessEnv;
  send?: typeof fetch;
  allow: () => boolean;
}) {
  return async (request: Request) => {
    const origin = request.headers.get("origin");
    const url = new URL(request.url);
    // Next's dev server can normalize request.url to localhost; use the HTTP Host
    // for local same-origin forms. Production must pin CONTACT_SITE_ORIGIN.
    if (options.env.NODE_ENV === "production" && !options.env.CONTACT_SITE_ORIGIN) {
      return reply({ message: "Online inquiries are temporarily unavailable. Please contact us directly. Your inquiry has not been sent." }, 503);
    }
    const expectedOrigin = options.env.CONTACT_SITE_ORIGIN || `${url.protocol}//${request.headers.get("host") || url.host}`;
    if (!origin || origin !== expectedOrigin || request.headers.get("sec-fetch-site") === "cross-site") {
      return reply({ message: "Please submit the form from the Crestlane website." }, 403);
    }
    if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") {
      return reply({ message: "Send the project form as JSON." }, 415);
    }
    if (!options.allow()) return reply({ message: "Too many requests. Please wait a minute or contact us directly." }, 429, { "Retry-After": "60" });
    if (Number(request.headers.get("content-length")) > MAX_BYTES) return reply({ message: "Your inquiry is too long." }, 413);
    let input: unknown;
    try {
      // Bound the actual stream, including requests without Content-Length.
      const reader = request.body?.getReader();
      if (!reader) return reply({ message: "Please complete the project form." }, 400);
      let size = 0;
      const chunks: Uint8Array[] = [];
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_BYTES) { await reader.cancel(); return reply({ message: "Your inquiry is too long." }, 413); }
        chunks.push(value);
      }
      input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch { return reply({ message: "We could not read the form. Please try again." }, 400); }
    const { inquiry, errors } = validateInquiry(input);
    if (!inquiry) return reply({ message: "Please check the highlighted fields.", errors }, 400);
    if (inquiry.companyFax) return reply({ message: "We could not accept this inquiry. Please contact us directly." }, 400);
    const { RESEND_API_KEY: key, CONTACT_FROM_EMAIL: from, CONTACT_TO_EMAIL: to } = options.env;
    if (!key || !from || !to) return reply({ message: "Online inquiries are temporarily unavailable. Please email sales@crestlanedigital.com or call us. Your inquiry has not been sent." }, 503);
    const reference = randomUUID();
    const text = Object.entries(inquiry).filter(([field]) => field !== "companyFax")
      .map(([field, value]) => `${field}: ${Array.isArray(value) ? value.join(", ") : value || "Not provided"}`).join("\n\n");
    try {
      const response = await (options.send ?? fetch)("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": reference },
        body: JSON.stringify({ from, to: [to], reply_to: inquiry.email, subject: "New Crestlane project inquiry", text }),
        signal: AbortSignal.timeout(10_000),
      });
      const result = await response.json() as { id?: unknown };
      if (!response.ok || typeof result.id !== "string" || !result.id.trim()) {
        return reply({ message: "The email service did not confirm acceptance. Please contact us directly. Your details are still in the form." }, 502);
      }
      return reply({ status: "accepted", reference, message: "The email service accepted your inquiry for sending. Inbox delivery has not yet been confirmed. You can contact us directly if you need an immediate response." }, 202);
    } catch {
      // A timeout can happen after provider acceptance: never claim either delivery or definitive failure.
      return reply({ message: "We could not confirm whether the email service accepted your inquiry. Please contact us directly before resubmitting. Your details are still in the form." }, 502);
    }
  };
}
