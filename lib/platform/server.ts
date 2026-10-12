import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createHash } from "node:crypto";
import { ipAddress } from "@vercel/functions";
import { PlatformError } from "./validation";
export const SESSION = "crestlane-session";
export const GUEST = "crestlane-visitor";
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};
export function db(token?: string) {
  const url = process.env.CRESTLANE_SUPABASE_URL,
    key = token
      ? process.env.CRESTLANE_SUPABASE_ANON_KEY
      : process.env.CRESTLANE_SUPABASE_SERVICE_KEY;
  if (!url || !key)
    throw new PlatformError(
      503,
      "This service is being connected. Please email sales@crestlanedigital.com or call (703) 431-4468.",
    );
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      fetch: (url, init) =>
        fetch(url, { ...init, signal: AbortSignal.timeout(12000) }),
    },
  });
}
export function check<T>(result: { data: T; error: unknown }): NonNullable<T> {
  if (result.error)
    throw new PlatformError(
      503,
      "The service could not complete this request. Please try again or contact us.",
    );
  return result.data as NonNullable<T>;
}
export async function identity(staff = false) {
  const token = (await cookies()).get(SESSION)?.value;
  if (!token) throw new PlatformError(401, "Please sign in.");
  const client = db(token);
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user?.email_confirmed_at)
    throw new PlatformError(401, "Your session expired. Please sign in.");
  const account = check(
    await client
      .from("crestlane_accounts")
      .select("id,name,role")
      .eq("id", data.user.id)
      .maybeSingle(),
  );
  if (!account)
    throw new PlatformError(
      403,
      "Your account has not been invited to the workspace.",
    );
  if (staff && account.role !== "staff")
    throw new PlatformError(403, "Staff access required.");
  return { client, user: data.user, account };
}
export function origin(request: Request) {
  const expected = process.env.CONTACT_SITE_ORIGIN;
  if (process.env.NODE_ENV === "production" && !expected)
    throw new PlatformError(503, "Site origin is not configured.");
  const allowed = new Set([expected ?? new URL(request.url).origin]);
  if (
    expected === "https://crestlanedigital.com" ||
    expected === "https://www.crestlanedigital.com"
  ) {
    allowed.add("https://crestlanedigital.com");
    allowed.add("https://www.crestlanedigital.com");
  }
  if (
    !allowed.has(request.headers.get("origin") ?? "") ||
    request.headers.get("sec-fetch-site") === "cross-site"
  )
    throw new PlatformError(403, "Please use the Crestlane website.");
}
export function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}
export async function limit(request: Request, bucket: string, user?: string) {
  const ip =
    process.env.NODE_ENV === "production" ? ipAddress(request) : "development";
  if (!ip && !user)
    throw new PlatformError(503, "Request protection is unavailable.");
  const key = hash(`${bucket}:${user ?? ip}`);
  const allowed = check(
    await db().rpc("crestlane_take_limit", {
      p_key: key,
      p_limit: bucket === "login" ? 8 : bucket === "staff" ? 120 : 30,
      p_window: 600,
    }),
  );
  if (!allowed)
    throw new PlatformError(
      429,
      "Please wait ten minutes before trying again.",
    );
}
export async function jsonInput(request: Request) {
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new PlatformError(415, "Use JSON.");
  const reader = request.body?.getReader();
  if (!reader) throw new PlatformError(400, "Complete the form.");
  let n = 0;
  const chunks = [];
  for (;;) {
    const r = await reader.read();
    if (r.done) break;
    n += r.value.length;
    if (n > 24000) {
      await reader.cancel();
      throw new PlatformError(413, "Request is too large.");
    }
    chunks.push(r.value);
  }
  try {
    const value = JSON.parse(Buffer.concat(chunks).toString());
    if (!value || typeof value !== "object" || Array.isArray(value)) throw 0;
    return value as Record<string, unknown>;
  } catch {
    throw new PlatformError(400, "Check the form.");
  }
}
export async function notify(
  subject: string,
  body: string,
  replyTo?: string,
  recipient?: string,
) {
  const key = process.env.RESEND_API_KEY,
    from = process.env.CONTACT_FROM_EMAIL,
    to = recipient ?? process.env.CONTACT_TO_EMAIL;
  if (!key || !from || !to) return "not_configured";
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        ...(replyTo ? { reply_to: replyTo } : {}),
        subject,
        text: body,
      }),
      signal: AbortSignal.timeout(10000),
    });
    const result = await response.json();
    return response.ok && typeof result.id === "string"
      ? "accepted"
      : "unconfirmed";
  } catch {
    return "unconfirmed";
  }
}
export async function guestConversation() {
  const token = (await cookies()).get(GUEST)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token))
    throw new PlatformError(401, "Start a conversation first.");
  const client = db();
  const conversation = check(
    await client
      .from("crestlane_conversations")
      .select("id,name")
      .eq("token_hash", hash(token))
      .maybeSingle(),
  );
  if (!conversation) throw new PlatformError(401, "Conversation unavailable.");
  return { client, conversation };
}
