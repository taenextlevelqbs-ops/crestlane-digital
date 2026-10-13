import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";
import Module, { createRequire } from "node:module";
import { PGlite } from "@electric-sql/pglite";
const require = createRequire(import.meta.url);
require.extensions[".ts"] = (module, filename) =>
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
    filename,
  );
const {
  validateLead,
  safeUrl,
  uuid,
} = require("../lib/platform/validation.ts");
const lead = {
  name: "Visitor",
  email: "visitor@example.com",
  projectType: "Website",
  budget: "Help me estimate",
  timeline: "Flexible",
  description: "A business website",
};
test("quote validation rejects invalid contact, URL, honeypot, unknown types and oversized fields", () => {
  assert.equal(
    validateLead("quote", lead).details.description,
    lead.description,
  );
  for (const change of [
    { name: "" },
    { email: "not-an-email" },
    { companyFax: "bot" },
    { projectType: "invented" },
    { website: "javascript:alert(1)" },
    { features: "x".repeat(901) },
  ])
    assert.throws(() => validateLead("quote", { ...lead, ...change }));
  assert.throws(() => safeUrl("https://user:pass@example.com"));
  assert.throws(() => uuid("invalid"));
});
test("consultations retain timezone and are requests without fabricated booking time", () => {
  const result = validateLead("consultation", {
    name: "Visitor",
    email: "v@example.com",
    duration: "30",
    preferred: "Tuesday afternoon",
    timezone: "America/New_York",
    format: "Zoom",
  });
  assert.equal(result.details.timezone, "America/New_York");
  assert.equal(result.scheduled_at, undefined);
  assert.throws(() =>
    validateLead("consultation", { ...result, duration: "60" }),
  );
});
const A = "11111111-1111-4111-8111-111111111111",
  B = "22222222-2222-4222-8222-222222222222",
  S = "33333333-3333-4333-8333-333333333333",
  P = "44444444-4444-4444-8444-444444444444",
  M = "55555555-5555-4555-8555-555555555555";
async function database() {
  const db = new PGlite();
  await db.exec(
    `create role anon; create role authenticated; create role service_role bypassrls; create schema auth;create schema storage;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text);alter table storage.objects enable row level security;grant usage on schema auth,storage to authenticated;grant select,insert on storage.objects to authenticated;`,
  );
  await db.exec(
    fs.readFileSync(
      new URL("../database/001-platform.sql", import.meta.url),
      "utf8",
    ),
  );
  await db.exec(
    `insert into auth.users values('${A}'),('${B}'),('${S}');insert into crestlane_accounts(id,name,role) values('${A}','Client A','client'),('${B}','Client B','client'),('${S}','Staff','staff');insert into crestlane_projects(id,client_id,title) values('${P}','${A}','Private project');insert into crestlane_milestones(id,project_id,title,status) values('${M}','${P}','Design','Ready for approval');`,
  );
  return db;
}
async function asUser(db, id) {
  await db.exec(
    `reset role; set request.jwt.claim.sub='${id}';set role authenticated;`,
  );
}
test("actual PostgreSQL migration enforces client isolation and prevents role escalation", async () => {
  const db = await database();
  try {
    await asUser(db, B);
    assert.equal(
      (await db.query("select * from crestlane_projects")).rows.length,
      0,
    );
    assert.equal(
      (await db.query("select * from crestlane_milestones")).rows.length,
      0,
    );
    await assert.rejects(
      db.exec(
        `insert into crestlane_project_messages(project_id,sender_id,body)values('${P}','${B}','Intrusion')`,
      ),
    );
    await assert.rejects(
      db.exec(`update crestlane_accounts set role='staff' where id='${B}'`),
    );
    await assert.rejects(
      db.exec(
        `insert into storage.objects(bucket_id,name)values('crestlane-projects','${P}/intrusion')`,
      ),
    );
    await assert.rejects(
      db.exec(`select crestlane_approve('${M}','Approved','Unauthorized')`),
    );
    await asUser(db, A);
    assert.equal(
      (await db.query("select * from crestlane_projects")).rows.length,
      1,
    );
    await db.exec(
      `insert into crestlane_project_messages(project_id,sender_id,body)values('${P}','${A}','Hello');select crestlane_approve('${M}','Approved','Looks good');`,
    );
    assert.equal(
      (await db.query("select status from crestlane_milestones")).rows[0]
        .status,
      "Approved",
    );
    await assert.rejects(
      db.exec(`select crestlane_approve('${M}','Changes requested','Replay')`),
    );
    await db.exec(
      `insert into storage.objects(bucket_id,name)values('crestlane-projects','${P}/authorized')`,
    );
    await asUser(db, B);
    assert.equal(
      (await db.query("select * from storage.objects")).rows.length,
      0,
    );
    assert.equal(
      (await db.query("select * from crestlane_project_messages")).rows.length,
      0,
    );
    await asUser(db, S);
    assert.equal(
      (await db.query("select * from crestlane_projects")).rows.length,
      1,
    );
    assert.equal(
      (await db.query("select * from storage.objects")).rows.length,
      1,
    );
    await db.exec("reset role;set role anon;");
    await assert.rejects(db.query("select * from crestlane_leads"));
    await assert.rejects(db.query("select * from crestlane_accounts"));
  } finally {
    await db.close();
  }
});
test("database persists lead/chat, blocks anonymous capabilities and has atomic shared limits", async () => {
  const db = await database();
  try {
    await db.exec(
      `insert into crestlane_leads(kind,name,email,details)values('quote','Visitor','v@example.com','{"description":"Build my site"}');insert into crestlane_conversations(id,token_hash,name,email)values('${P}','sha256-only','Visitor','v@example.com');insert into crestlane_chat_messages(conversation_id,sender,body)values('${P}','visitor','Hello'),('${P}','staff','How can we help?');`,
    );
    await asUser(db, A);
    assert.equal(
      (await db.query("select * from crestlane_conversations")).rows.length,
      0,
    );
    await db.exec("reset role");
    assert.equal(
      (
        await db.query(
          "select * from crestlane_chat_messages order by created_at",
        )
      ).rows.length,
      2,
    );
    for (let i = 0; i < 3; i++)
      assert.equal(
        (await db.query(`select crestlane_take_limit('test',2,600) as allowed`))
          .rows[0].allowed,
        i < 2,
      );
    await asUser(db, A);
    await assert.rejects(db.query(`select crestlane_take_limit('test',2,600)`));
  } finally {
    await db.close();
  }
});
// Real API handler with provider fixtures. These hooks exist only in this test process.
const jar = new Map();
const originalLoad = Module._load;
Module._load = function (name, ...args) {
  if (name === "next/headers")
    return {
      cookies: async () => ({
        get: (key) => (jar.has(key) ? { value: jar.get(key) } : undefined),
        set: (key, value) => jar.set(key, value),
      }),
    };
  return originalLoad.call(this, name, ...args);
};
const { GET, POST } = require("../app/api/platform/[...path]/route.ts");
const originalFetch = global.fetch;
const env = { ...process.env };
process.env.CRESTLANE_SUPABASE_URL = "https://fixture.supabase.co";
process.env.CRESTLANE_SUPABASE_ANON_KEY = "fixture-anon";
process.env.CRESTLANE_SUPABASE_SERVICE_KEY = "fixture-service";
process.env.CONTACT_SITE_ORIGIN = "https://crestlanedigital.com";
delete process.env.RESEND_API_KEY;
let aiOutput = '{"faq_indexes":[1],"needs_team":true}';
let verified = true,
  invited = true;
let stored = [],
  chats = [],
  conversations = [],
  calls = [];
global.fetch = async (url, init = {}) => {
  url = String(url);
  calls.push(url);
  const path = new URL(url).pathname;
  const method = init.method ?? "GET";
  if (path === "/v1/chat/completions")
    return Response.json({ choices: [{ message: { content: aiOutput } }] });
  if (path === "/v1/messages")
    return Response.json({ content: [{ type: "text", text: aiOutput }] });
  const payload = init.body ? JSON.parse(init.body) : null;
  if (path.endsWith("/rpc/crestlane_take_limit")) return Response.json(true);
  if (path.endsWith("/rpc/crestlane_start_chat")) {
    stored.push({ id: P, kind: "chat" });
    conversations.push({
      id: M,
      lead_id: P,
      token_hash: payload.p_hash,
      name: payload.p_name,
      email: payload.p_email,
    });
    chats.push({
      id: "initial",
      conversation_id: M,
      sender: "visitor",
      body: payload.p_body,
      created_at: new Date().toISOString(),
    });
    return Response.json(M);
  }
  if (path.endsWith("/auth/v1/token"))
    return Response.json({
      access_token: "fixture-user-token",
      refresh_token: "fixture-refresh",
      expires_in: 3600,
      token_type: "bearer",
      user: {
        id: A,
        email: "client@example.com",
        email_confirmed_at: new Date().toISOString(),
      },
    });
  if (path.endsWith("/auth/v1/user")) {
    if (new Headers(init.headers).get("Authorization") === "Bearer invalid")
      return Response.json({ message: "Invalid JWT" }, { status: 401 });
    return Response.json({
      id: A,
      email: "client@example.com",
      email_confirmed_at: verified ? new Date().toISOString() : null,
    });
  }
  if (path.endsWith("/crestlane_accounts"))
    return Response.json(
      invited ? { id: A, name: "Client A", role: "client" } : null,
    );
  if (path.endsWith("/crestlane_leads")) {
    if (method === "POST") {
      const row = { ...payload, id: P };
      stored.push(row);
      return Response.json(row);
    }
    return Response.json(null);
  }
  if (path.endsWith("/crestlane_conversations")) {
    if (method === "POST") {
      const row = { ...payload, id: M };
      conversations.push(row);
      return Response.json(row);
    }
    return Response.json(
      conversations.find(
        (c) =>
          new URL(url).searchParams.get("token_hash") === `eq.${c.token_hash}`,
      ) ?? null,
    );
  }
  if (path.endsWith("/crestlane_chat_messages")) {
    if (method === "POST") {
      chats.push({
        ...payload,
        id: randomId(),
        created_at: new Date().toISOString(),
      });
      return Response.json(null);
    }
    return Response.json([...chats].reverse());
  }
  if (path.endsWith("/crestlane_projects")) return Response.json([]);
  return Response.json(null);
};
function randomId() {
  return String(chats.length);
}
const req = (path, data, origin = "https://crestlanedigital.com") =>
  new Request(
    `https://crestlanedigital.com/api/platform/${path}`,
    data
      ? {
          method: "POST",
          headers: { origin, "content-type": "application/json" },
          body: JSON.stringify(data),
        }
      : {},
  );
const ctx = (path) => ({ params: Promise.resolve({ path: path.split("/") }) });
test("API authenticates verified invited accounts and rejects anonymous staff access", async () => {
  jar.clear();
  assert.equal((await GET(req("workspace"), ctx("workspace"))).status, 401);
  assert.equal(
    (
      await POST(
        req("login", {
          email: "client@example.com",
          password: "fixture-password",
        }),
        ctx("login"),
      )
    ).status,
    200,
  );
  assert.equal(jar.get("crestlane-session"), "fixture-user-token");
  assert.equal(
    (
      await POST(
        req("staff/project", { title: "intrude" }),
        ctx("staff/project"),
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await POST(
        req("lead", { kind: "quote", ...lead }, "https://evil.example"),
        ctx("lead"),
      )
    ).status,
    403,
  );
});
test("API saves real lead before reporting success even with mail unconfigured", async () => {
  const r = await POST(req("lead", { kind: "quote", ...lead }), ctx("lead"));
  assert.equal(r.status, 201);
  const body = await r.json();
  assert.equal(body.notification, "not_configured");
  assert.equal(stored.at(-1).details.description, lead.description);
  assert.match(body.message, /saved/);
});
test("chat capability resumes persisted conversation and never trusts caller conversation ID", async () => {
  jar.delete("crestlane-visitor");
  conversations = [];
  chats = [];
  assert.equal(
    (
      await POST(
        req("chat/start", {
          name: "Visitor",
          email: "v@example.com",
          message: "Hello",
        }),
        ctx("chat/start"),
      )
    ).status,
    201,
  );
  const token = jar.get("crestlane-visitor");
  assert.equal(token.length, 64);
  assert.notEqual(conversations[0].token_hash, token);
  assert.equal(
    (
      await POST(
        req("chat/message", {
          message: "Another",
          conversation_id: "attacker-supplied",
        }),
        ctx("chat/message"),
      )
    ).status,
    201,
  );
  assert.equal(chats[1].conversation_id, M);
  const r = await GET(req("chat"), ctx("chat"));
  assert.equal(r.status, 200);
  assert.equal((await r.json()).messages.length, 2);
  jar.set("crestlane-visitor", "a".repeat(64));
  assert.equal((await GET(req("chat"), ctx("chat"))).status, 401);
});
test("unverified, revoked and uninvited sessions cannot access protected data", async () => {
  jar.set("crestlane-session", "invalid");
  assert.equal((await GET(req("workspace"), ctx("workspace"))).status, 401);
  jar.set("crestlane-session", "fixture-user-token");
  verified = false;
  assert.equal((await GET(req("workspace"), ctx("workspace"))).status, 401);
  verified = true;
  invited = false;
  assert.equal((await GET(req("workspace"), ctx("workspace"))).status, 403);
  invited = true;
});
test("atomic chat creation grants only service access and rolls back bad input", async () => {
  const sql = await database();
  try {
    await sql.exec("set role service_role");
    const created = await sql.query(
      `select crestlane_start_chat('${"a".repeat(64)}','Visitor','visitor@example.com','A saved first message') as id`,
    );
    assert.ok(created.rows[0].id);
    assert.equal(
      (await sql.query("select * from crestlane_chat_messages")).rows.length,
      1,
    );
    assert.equal(
      (await sql.query("select * from crestlane_leads")).rows.length,
      1,
    );
    await assert.rejects(
      sql.query(
        `select crestlane_start_chat('invalid','Visitor','visitor@example.com','message')`,
      ),
    );
    assert.equal(
      (await sql.query("select * from crestlane_leads")).rows.length,
      1,
    );
    await asUser(sql, A);
    await assert.rejects(
      sql.query(
        `select crestlane_start_chat('${"b".repeat(64)}','Visitor','visitor@example.com','message')`,
      ),
    );
  } finally {
    await sql.close();
  }
});
test("AI provider selection renders only approved knowledge and rejects invented prices", async () => {
  process.env.CRESTLANE_AI_API_KEY = "fixture-ai-secret";
  for (const provider of ["openai", "anthropic"]) {
    process.env.CRESTLANE_AI_PROVIDER = provider;
    aiOutput = '{"faq_indexes":[1],"needs_team":true}';
    const good = await POST(
      req("assistant", { question: "What will this cost?" }),
      ctx("assistant"),
    );
    const body = await good.json();
    assert.equal(body.mode, "ai");
    assert.match(body.answer, /tailored proposal/);
    assert.ok(!body.answer.includes("fixture-ai-secret"));
    aiOutput = "Your project will cost $900, guaranteed.";
    const bad = await POST(
      req("assistant", { question: "Invent a fixed price" }),
      ctx("assistant"),
    );
    const fallback = await bad.json();
    assert.equal(fallback.mode, "faq");
    assert.ok(!fallback.answer.includes("$900"));
    aiOutput = '{"faq_indexes":[999]}';
    const invalid = await POST(
      req("assistant", { question: "Question" }),
      ctx("assistant"),
    );
    assert.equal((await invalid.json()).mode, "faq");
  }
  delete process.env.CRESTLANE_AI_API_KEY;
  delete process.env.CRESTLANE_AI_PROVIDER;
});
test.after(() => {
  global.fetch = originalFetch;
  Module._load = originalLoad;
  for (const k of Object.keys(process.env))
    if (!(k in env)) delete process.env[k];
  Object.assign(process.env, env);
});
