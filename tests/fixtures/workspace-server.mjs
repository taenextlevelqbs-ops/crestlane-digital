// Test-only Supabase protocol fixture. No production imports or bypass flags.
import http from "node:http";
import { spawn } from "node:child_process";
const A = "11111111-1111-4111-8111-111111111111",
  B = "22222222-2222-4222-8222-222222222222",
  P = "44444444-4444-4444-8444-444444444444",
  M = "55555555-5555-4555-8555-555555555555";
const rows = {
  crestlane_accounts: [
    { id: A, name: "Fixture client", role: "client" },
    { id: B, name: "Fixture staff", role: "staff" },
  ],
  crestlane_projects: [
    {
      id: P,
      client_id: A,
      title: "Fixture project",
      status: "Review",
      description: "Your new website",
      created_at: "2026-10-12T12:00:00Z",
    },
  ],
  crestlane_milestones: [
    {
      id: M,
      project_id: P,
      title: "Homepage design",
      status: "Ready for approval",
      created_at: "2026-10-12T12:00:00Z",
    },
  ],
  crestlane_project_messages: [],
  crestlane_files: [],
  crestlane_invoices: [],
  crestlane_leads: [],
  crestlane_conversations: [],
  crestlane_chat_messages: [],
  crestlane_presence: [],
  crestlane_faqs: [],
};
let count = 0;
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1:3499");
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks);
  let body = {};
  try {
    body = JSON.parse(raw.toString());
  } catch {}
  const reply = (value, status = 200) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(value));
  };
  const token = req.headers.authorization;
  const staff = token === "Bearer fixture-staff";
  if (url.pathname === "/auth/v1/token")
    return body.password === "fixture-password"
      ? reply({
          access_token:
            body.email === "staff@example.com"
              ? "fixture-staff"
              : "fixture-client",
          refresh_token: "fixture-refresh",
          expires_in: 3600,
          token_type: "bearer",
          user: {
            id: body.email === "staff@example.com" ? B : A,
            email: body.email,
            email_confirmed_at: "2026-01-01T00:00:00Z",
          },
        })
      : reply({ message: "Invalid login" }, 401);
  if (url.pathname === "/auth/v1/user")
    return reply({
      id: staff ? B : A,
      email: staff ? "staff@example.com" : "client@example.com",
      email_confirmed_at: "2026-01-01T00:00:00Z",
    });
  if (url.pathname.startsWith("/auth/v1/logout")) return reply({});
  if (url.pathname.endsWith("/rpc/crestlane_take_limit")) return reply(true);
  if (url.pathname.endsWith("/rpc/crestlane_approve")) {
    const m = rows.crestlane_milestones.find((r) => r.id === body.p_id);
    m.status = body.p_status;
    m.client_feedback = body.p_feedback;
    return reply(null);
  }
  if (url.pathname.endsWith("/rpc/crestlane_start_chat")) {
    const id = "66666666-6666-4666-8666-666666666666";
    rows.crestlane_leads.push({
      id,
      kind: "chat",
      name: body.p_name,
      email: body.p_email,
      status: "new",
      notification_status: "pending",
      details: { description: body.p_body },
      created_at: new Date().toISOString(),
    });
    rows.crestlane_conversations.push({
      id,
      lead_id: id,
      name: body.p_name,
      email: body.p_email,
      token_hash: body.p_hash,
      staff_read_at: "1970-01-01T00:00:00Z",
      created_at: new Date().toISOString(),
    });
    rows.crestlane_chat_messages.push({
      id: "first-message",
      conversation_id: id,
      sender: "visitor",
      body: body.p_body,
      created_at: new Date().toISOString(),
    });
    return reply(id);
  }
  if (url.pathname.startsWith("/storage/v1/object/"))
    return reply({ Key: url.pathname.split("/object/")[1] });
  const table = url.pathname.split("/").at(-1);
  if (!(table in rows))
    return reply({ message: "Unknown fixture endpoint" }, 404);
  const filters = [...url.searchParams].filter(([, v]) => v.startsWith("eq."));
  const match = (r) => filters.every(([k, v]) => String(r[k]) === v.slice(3));
  if (req.method === "POST") {
    const record = {
      id: `00000000-0000-4000-8000-${String(++count).padStart(12, "0")}`,
      created_at: new Date().toISOString(),
      ...body,
    };
    if (req.headers.prefer?.includes("resolution=merge-duplicates")) {
      const old = rows[table].find((r) => r.user_id === record.user_id);
      if (old) {
        Object.assign(old, record);
        return reply(null);
      }
    }
    rows[table].push(record);
    return reply(req.headers.accept?.includes("object") ? record : [record]);
  }
  if (req.method === "PATCH") {
    for (const r of rows[table].filter(match)) Object.assign(r, body);
    return reply(null);
  }
  const selected = rows[table].filter(match);
  return reply(
    req.headers.accept?.includes("object") ? (selected[0] ?? null) : selected,
  );
});
await new Promise((resolve) => server.listen(3499, "127.0.0.1", resolve));
const env = {
  ...process.env,
  CRESTLANE_SUPABASE_URL: "http://127.0.0.1:3499",
  CRESTLANE_SUPABASE_ANON_KEY: "fixture-anon",
  CRESTLANE_SUPABASE_SERVICE_KEY: "fixture-service",
  CONTACT_SITE_ORIGIN: "http://127.0.0.1:3006",
};
delete env.RESEND_API_KEY;
delete env.CRESTLANE_AI_API_KEY;
const child = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "dev",
    "--hostname",
    "127.0.0.1",
    "--port",
    "3006",
  ],
  { env, stdio: "inherit" },
);
function stop() {
  child.kill("SIGTERM");
  server.close();
}
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
child.on("exit", (code) => {
  server.close();
  process.exit(code ?? 0);
});
