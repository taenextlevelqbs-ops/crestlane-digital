export const serviceOptions = [
  "Websites", "Custom software & portals", "Automation & AI", "Website security", "Ongoing support",
] as const;

export const fieldLimits = {
  name: 100, email: 254, phone: 40, organization: 160, type: 100,
  website: 300, details: 1800, stage: 100, budget: 100, timeline: 100,
  contact: 30, challenges: 900, features: 900, companyFax: 100,
} as const;

export type ContactField = keyof typeof fieldLimits;
export type Inquiry = Record<ContactField, string> & { interests: string[] };
export type FieldErrors = Partial<Record<ContactField | "interests", string>>;

export function validateInquiry(input: unknown): { inquiry?: Inquiry; errors: FieldErrors } {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { errors: { details: "Please complete the project form." } };
  }
  const raw = input as Record<string, unknown>;
  const errors: FieldErrors = {};
  const inquiry = {} as Inquiry;
  for (const [field, max] of Object.entries(fieldLimits)) {
    const key = field as ContactField;
    const value = raw[key] ?? "";
    if (typeof value !== "string") { errors[key] = "Please enter text."; inquiry[key] = ""; continue; }
    inquiry[key] = value.trim();
    if (inquiry[key].length > max) errors[key] = `Use ${max} characters or fewer.`;
    if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) errors[key] = "Remove unsupported characters.";
  }
  if (!inquiry.name) errors.name = "Enter your name.";
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(inquiry.email)) errors.email = "Enter a valid email address.";
  if (!inquiry.details) errors.details = "Tell us about your project.";
  if (inquiry.phone && !/^[+()\d\s.\-x]+$/i.test(inquiry.phone)) errors.phone = "Enter a valid phone number.";
  if (!["", "Email", "Phone call", "Text message"].includes(inquiry.contact)) errors.contact = "Choose a contact method.";
  if (["Phone call", "Text message"].includes(inquiry.contact) && (inquiry.phone.match(/\d/g)?.length ?? 0) < 7) {
    errors.phone = "Enter a phone number for a call or text.";
  }
  if (inquiry.website) {
    try {
      const url = new URL(inquiry.website.includes("://") ? inquiry.website : `https://${inquiry.website}`);
      if (!["https:", "http:"].includes(url.protocol) || !url.hostname.includes(".") || url.username || url.password) throw new Error("Invalid URL");
    } catch { errors.website = "Enter a website address, such as yourbusiness.com."; }
  }
  const interests = raw.interests ?? [];
  if (!Array.isArray(interests) || interests.length > serviceOptions.length || interests.some((v) => typeof v !== "string" || !serviceOptions.some((option) => option === v))) {
    errors.interests = "Choose services from the listed options.";
    inquiry.interests = [];
  } else inquiry.interests = [...new Set(interests)];
  return Object.keys(errors).length ? { errors } : { inquiry, errors };
}
