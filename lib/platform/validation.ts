export class PlatformError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function text(
  input: unknown,
  label: string,
  max = 1800,
  required = true,
): string {
  if (
    typeof input !== "string" ||
    input.length > max ||
    /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(input)
  )
    throw new PlatformError(400, `Check ${label}.`);
  const value = input.trim();
  if (required && !value) throw new PlatformError(400, `Enter ${label}.`);
  return value;
}
export function email(input: unknown) {
  const value = text(input, "email", 254);
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value))
    throw new PlatformError(400, "Enter a valid email.");
  return value;
}
export function uuid(input: unknown) {
  const value = text(input, "identifier", 36);
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      value,
    )
  )
    throw new PlatformError(400, "Invalid identifier.");
  return value;
}
export function choice(input: unknown, values: readonly string[]) {
  if (typeof input !== "string" || !values.includes(input))
    throw new PlatformError(400, "Choose a listed option.");
  return input;
}
export function safeUrl(value: unknown) {
  const raw = text(value, "URL", 500, false);
  if (!raw) return "";
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || url.username || url.password) throw 0;
    return url.href;
  } catch {
    throw new PlatformError(400, "Use a full HTTPS URL.");
  }
}
export function validateLead(kind: string, data: Record<string, unknown>) {
  const name = text(data.name, "name", 100),
    contact = email(data.email);
  const phone = text(data.phone ?? "", "phone", 40, false);
  if (data.companyFax)
    throw new PlatformError(400, "Submission could not be accepted.");
  let details: Record<string, string>;
  if (kind === "quote")
    details = {
      phone,
      business: text(data.business ?? "", "business", 160, false),
      projectType: choice(data.projectType, [
        "Website",
        "Online store",
        "Software / portal",
        "Automation",
        "Security / support",
        "Not sure",
      ]),
      features: text(data.features ?? "", "features", 900, false),
      design: text(data.design ?? "", "design preferences", 900, false),
      website: safeUrl(data.website ?? ""),
      budget: text(data.budget, "budget", 100),
      timeline: text(data.timeline, "timeline", 100),
      description: text(data.description, "project details"),
    };
  else {
    if (data.format === "Phone" && (phone.match(/\d/g)?.length ?? 0) < 7)
      throw new PlatformError(
        400,
        "Enter a phone number for your phone consultation.",
      );
    const duration = choice(data.duration, ["15", "30"]);
    const preferred = text(data.preferred, "preferred time", 200);
    details = {
      phone,
      duration,
      preferred,
      timezone: text(data.timezone, "time zone", 100),
      format: choice(data.format, ["Phone", "Google Meet", "Zoom"]),
      description: text(data.description ?? "", "project details", 1800, false),
    };
  }
  return { kind, name, email: contact, details };
}
export const fallbackFaqs = [
  {
    question: "What does Crestlane build?",
    answer:
      "Business websites, custom software and portals, automation, website security, and ongoing support. Scope is agreed with you.",
  },
  {
    question: "How much does a project cost?",
    answer:
      "Your goals and requirements determine the scope. Share your budget and vision for a tailored proposal. No fixed pricing is promised.",
  },
  {
    question: "How does the process work?",
    answer:
      "Understand your work, agree on scope, design the right system, then build, launch, and improve with your input.",
  },
];
