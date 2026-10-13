"use client";
import { iconText } from "../StudioIcons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
type Row = {
  id: string;
  project_id?: string;
  title?: string;
  status?: string;
  description?: string;
  client_id?: string;
  name?: string;
  email?: string;
  kind?: string;
  details?: Record<string, string>;
  notification_status?: string;
  scheduled_at?: string;
  meeting_url?: string;
  staff_read_at?: string;
  conversation_id?: string;
  sender?: string;
  sender_id?: string;
  body?: string;
  created_at: string;
  client_feedback?: string;
  label?: string;
  amount_minor?: number;
  currency?: string;
  size?: number;
  role?: string;
  question?: string;
  answer?: string;
  published?: boolean;
};
type Data = {
  account: { id: string; name: string; role: string };
  projects: Row[];
  milestones: Row[];
  messages: Row[];
  files: Row[];
  invoices: Row[];
  leads?: Row[];
  conversations?: Row[];
  chat?: Row[];
  customers?: Row[];
  faqs?: Row[];
};
const stamp = (v: string) => new Date(v).toLocaleString();
export default function Workspace({ staff }: { staff: boolean }) {
  const router = useRouter();
  const [data, setData] = useState<Data | null>(null),
    [tab, setTab] = useState(staff ? "Overview" : "Projects"),
    [selected, setSelected] = useState(""),
    [conversation, setConversation] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [available, setAvailable] = useState(false);
  const lock = useRef(false);
  const loading = useRef(false);
  const load = useCallback(async () => {
    if (loading.current) return;
    loading.current = true;
    try {
      const r = await fetch("/api/platform/workspace", {
        signal: AbortSignal.timeout(20000),
      });
      const value = await r.json();
      if (r.status === 401) {
        router.replace("/portal/login");
        return;
      }
      if (!r.ok) throw new Error(value.message);
      setData(value);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Unable to load workspace.");
    } finally {
      loading.current = false;
    }
  }, [router]);
  useEffect(() => {
    void load();
    const timer = setInterval(() => {
      if (!document.hidden) void load();
    }, 5000);
    return () => clearInterval(timer);
  }, [load]);
  async function act(path: string, payload: unknown, form?: HTMLFormElement) {
    if (lock.current) return null;
    lock.current = true;
    setBusy(true);
    setMessage("");
    try {
      const r = await fetch(`/api/platform/${path}`, {
        method: "POST",
        headers:
          payload instanceof FormData
            ? undefined
            : { "Content-Type": "application/json" },
        body: payload instanceof FormData ? payload : JSON.stringify(payload),
      });
      const result = await r.json();
      if (!r.ok) throw new Error(result.message);
      form?.reset();
      setMessage(
        result.notification && result.notification !== "accepted"
          ? "Saved. The email notification is not confirmed."
          : "Saved successfully.",
      );
      await load();
      return result;
    } catch (e) {
      setMessage(
        e instanceof Error ? e.message : "Request could not be confirmed.",
      );
      return null;
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  useEffect(() => {
    if (!staff || !available) return;
    const ping = () =>
      fetch("/api/platform/staff/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: true }),
      })
        .then((r) => {
          if (!r.ok) setAvailable(false);
        })
        .catch(() => setAvailable(false));
    void ping();
    const timer = setInterval(() => {
      if (!document.hidden) void ping();
    }, 30000);
    return () => clearInterval(timer);
  }, [staff, available]);
  function submit(path: string, extra: Record<string, unknown> = {}) {
    return (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const fields = Object.fromEntries(new FormData(form));
      void act(
        path,
        {
          ...fields,
          ...extra,
          availability_verified: fields.availability_verified === "on",
          published: fields.published === "on",
        },
        form,
      );
    };
  }
  const input = (
    name: string,
    label: string,
    type = "text",
    required = true,
    value?: string,
  ) => (
    <label>
      {label}
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={value}
        maxLength={name === "email" ? 254 : 1800}
      />
    </label>
  );
  const select = (
    name: string,
    label: string,
    options: string[],
    value?: string,
  ) => (
    <label>
      {label}
      <select name={name} defaultValue={value}>
        {options.map((v) => (
          <option key={v}>{v}</option>
        ))}
      </select>
    </label>
  );
  const project =
    data?.projects.find((p) => p.id === selected) ?? data?.projects[0];
  const active = data?.conversations?.find((c) => c.id === conversation);
  const unread = (c: Row) =>
    data?.chat?.filter(
      (m) =>
        m.conversation_id === c.id &&
        m.sender === "visitor" &&
        m.created_at > (c.staff_read_at ?? ""),
    ).length ?? 0;
  const tabs = staff
    ? [
        "Overview",
        "Inbox",
        "Leads",
        "Consultations",
        "Customers",
        "Projects",
        "Knowledge",
      ]
    : ["Projects"];
  return (
    <main className="workspace-shell">
      <aside className="workspace-sidebar">
        <Link className="workspace-brand" href="/">
          Crestlane<span>Digital / {staff ? "studio" : "client space"}</span>
        </Link>
        <nav aria-label="Workspace navigation">
          {tabs.map((t) => (
            <button
              key={t}
              aria-current={tab === t ? "page" : undefined}
              onClick={() => setTab(t)}
            >
              {t}
              {t === "Inbox" && (
                <span>
                  {data?.conversations?.reduce((n, c) => n + unread(c), 0) ?? 0}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="workspace-account">
          <p>{data?.account.name || "Your workspace"}</p>
          {staff && (
            <label className="presence-toggle">
              <input
                type="checkbox"
                checked={available}
                onChange={(e) => {
                  setAvailable(e.target.checked);
                  void act("staff/presence", { available: e.target.checked });
                }}
              />
              Available for chat
            </label>
          )}
          <button
            onClick={async () => {
              if (await act("logout", {})) router.replace("/portal/login");
            }}
          >
            {iconText("Sign out ↗")}
          </button>
        </div>
      </aside>
      <section className="workspace-main">
        <header>
          <p className="eyebrow">
            CRESTLANE / {staff ? "TEAM OPERATIONS" : "YOUR PROJECT"}
          </p>
          <h1>
            {tab}
            <em>.</em>
          </h1>
          <p>
            {staff
              ? "A clear view of the conversations and work ahead."
              : "Your milestones, messages and decisions, in one place."}
          </p>
        </header>
        <p className="workspace-feedback" role="status" aria-live="polite">
          {message}
        </p>
        {!data && <p>Loading your secure workspace…</p>}
        {data && tab === "Overview" && (
          <>
            <div className="workspace-stats">
              {[
                [
                  "New leads",
                  data.leads?.filter((l) => l.status === "new").length ?? 0,
                ],
                [
                  "Unread chat messages",
                  data.conversations?.reduce((n, c) => n + unread(c), 0) ?? 0,
                ],
                [
                  "Consultation requests",
                  data.leads?.filter(
                    (l) =>
                      l.kind === "consultation" &&
                      l.status !== "approved" &&
                      l.status !== "closed",
                  ).length ?? 0,
                ],
                [
                  "Active projects",
                  data.projects.filter((p) => p.status !== "Launched").length,
                ],
              ].map(([label, value]) => (
                <article key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </article>
              ))}
            </div>
            <article className="workspace-card">
              <h3>Business pulse</h3>
              <p>
                Counts are based on the most recent workspace records: up to 200
                leads, 100 projects and 500 chat messages. They are not website
                traffic analytics or all-time totals.
              </p>
              <p>
                {data.leads?.filter((l) => l.notification_status !== "accepted")
                  .length ?? 0}{" "}
                recent requests need email notification review. The secure inbox
                remains the source of truth.
              </p>
              <button
                className="button primary"
                onClick={() => setTab("Inbox")}
              >
                {iconText("Open team inbox ↗")}
              </button>
            </article>
          </>
        )}
        {data && tab === "Inbox" && (
          <div className="workspace-inbox">
            <div className="workspace-list">
              {!data.conversations?.length && <p>No conversations yet.</p>}
              {data.conversations?.map((c) => (
                <button
                  key={c.id}
                  aria-pressed={active?.id === c.id}
                  onClick={() => {
                    setConversation(c.id);
                    void act("staff/read", { id: c.id });
                  }}
                >
                  <strong>{c.name}</strong>
                  <small>{c.email}</small>
                  <span>{unread(c)} unread</span>
                </button>
              ))}
            </div>
            <article className="workspace-card">
              {active ? (
                <>
                  <h3>{active.name}</h3>
                  <p>{active.email}</p>
                  <div className="hub-transcript" role="log" aria-live="polite">
                    {data.chat
                      ?.filter((m) => m.conversation_id === active.id)
                      .reverse()
                      .map((m) => (
                        <div className={`hub-message ${m.sender}`} key={m.id}>
                          <strong>
                            {m.sender === "staff"
                              ? "Crestlane team"
                              : active.name}
                          </strong>
                          <p>{m.body}</p>
                          <small>{stamp(m.created_at)}</small>
                        </div>
                      ))}
                  </div>
                  <form
                    className="hub-form"
                    onSubmit={submit("staff/reply", { id: active.id })}
                  >
                    <label>
                      Reply
                      <textarea name="message" required maxLength={4000} />
                    </label>
                    <button className="button primary" disabled={busy}>
                      {iconText("Send reply ↗")}
                    </button>
                  </form>
                </>
              ) : (
                <p>Select a conversation to respond.</p>
              )}
            </article>
          </div>
        )}
        {data && (tab === "Leads" || tab === "Consultations") && (
          <div className="workspace-grid">
            {!data.leads?.some(
              (l) => tab === "Leads" || l.kind === "consultation",
            ) && <p>No requests yet.</p>}
            {data.leads
              ?.filter((l) => tab === "Leads" || l.kind === "consultation")
              .map((l) => (
                <article className="workspace-card" key={l.id}>
                  <p className="eyebrow">
                    {l.kind} / {l.status}
                  </p>
                  <h3>{l.name}</h3>
                  <a href={`mailto:${l.email}`}>{l.email}</a>
                  <dl>
                    {Object.entries(l.details ?? {})
                      .filter(([, v]) => v)
                      .map(([k, v]) => (
                        <div key={k}>
                          <dt>{k}</dt>
                          <dd>{v}</dd>
                        </div>
                      ))}
                  </dl>
                  <small>
                    Requested {stamp(l.created_at)} · Email:{" "}
                    {l.notification_status}
                  </small>
                  <div className="hub-inline-actions">
                    {["reviewing", "closed"].map((status) => (
                      <button
                        key={status}
                        disabled={busy}
                        onClick={() =>
                          void act("staff/lead", { id: l.id, status })
                        }
                      >
                        Mark {status}
                      </button>
                    ))}
                  </div>
                  {l.kind === "consultation" &&
                    (l.status === "approved" ? (
                      <p>
                        Confirmed: {l.scheduled_at && stamp(l.scheduled_at)}{" "}
                        {l.meeting_url && (
                          <a
                            href={l.meeting_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {iconText("Meeting ↗")}
                          </a>
                        )}
                      </p>
                    ) : (
                      <details>
                        <summary>Review & confirm consultation</summary>
                        <form
                          className="hub-form"
                          onSubmit={(e) => {
                            e.preventDefault();
                            const form = e.currentTarget;
                            const fields = Object.fromEntries(
                              new FormData(form),
                            );
                            void act(
                              "staff/consultation",
                              {
                                ...fields,
                                id: l.id,
                                scheduled_at: new Date(
                                  String(fields.scheduled_at),
                                ).toISOString(),
                                availability_verified:
                                  fields.availability_verified === "on",
                              },
                              form,
                            );
                          }}
                        >
                          {input(
                            "scheduled_at",
                            "Confirmed date & time (your local time)",
                            "datetime-local",
                          )}
                          {input(
                            "meeting_url",
                            "Actual Google Meet / Zoom link",
                            "url",
                            false,
                          )}
                          <label className="presence-toggle">
                            <input
                              name="availability_verified"
                              type="checkbox"
                              required
                            />
                            I checked actual calendar availability and the
                            meeting details.
                          </label>
                          <button className="button primary" disabled={busy}>
                            Confirm & notify customer
                          </button>
                        </form>
                      </details>
                    ))}
                </article>
              ))}
          </div>
        )}
        {data && tab === "Customers" && (
          <>
            <article className="workspace-card">
              <h3>Invitation-only access</h3>
              <p>
                Create verified client accounts through Supabase Auth, then add
                their UUID and name to crestlane_accounts with role client.
                Staff roles are assigned only by the database administrator.
                Customers cannot assign themselves a role.
              </p>
            </article>
            <div className="workspace-grid">
              {data.customers?.map((c) => (
                <article className="workspace-card" key={c.id}>
                  <h3>{c.name || "Client account"}</h3>
                  <p>{c.id}</p>
                  <p>
                    {data.projects.filter((p) => p.client_id === c.id).length}{" "}
                    projects
                  </p>
                  <form
                    className="hub-form"
                    onSubmit={submit("staff/customer", { id: c.id })}
                  >
                    {input("name", "Customer name", "text", true, c.name)}
                    <button className="button primary" disabled={busy}>
                      Update customer
                    </button>
                  </form>
                </article>
              ))}
            </div>
          </>
        )}
        {data && tab === "Projects" && (
          <>
            <div className="workspace-project-tabs">
              {data.projects.map((p) => (
                <button
                  key={p.id}
                  aria-pressed={project?.id === p.id}
                  onClick={() => setSelected(p.id)}
                >
                  {p.title}
                </button>
              ))}
            </div>
            {!data.projects.length && (
              <article className="workspace-card">
                <h3>Your next chapter is on its way.</h3>
                <p>
                  No projects have been assigned yet. Your team will add your
                  project once its scope is agreed.
                </p>
              </article>
            )}
            {staff && (
              <details className="workspace-card">
                <summary>Create a project</summary>
                <form className="hub-form" onSubmit={submit("staff/project")}>
                  {input("title", "Project title")}
                  <label>
                    Client
                    <select name="client_id" required>
                      {data.customers?.map((c) => (
                        <option value={c.id} key={c.id}>
                          {c.name || c.id}
                        </option>
                      ))}
                    </select>
                  </label>
                  {select("status", "Status", [
                    "Planning",
                    "Design",
                    "Development",
                    "Review",
                    "Launched",
                    "On hold",
                  ])}
                  <label>
                    Description
                    <textarea name="description" maxLength={1800} />
                  </label>
                  <button
                    className="button primary"
                    disabled={busy || !data.customers?.length}
                  >
                    Create project
                  </button>
                </form>
              </details>
            )}
            {project && (
              <>
                <article className="workspace-card">
                  <p className="eyebrow">{project.status}</p>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  {staff && (
                    <details>
                      <summary>Update project</summary>
                      <form
                        className="hub-form"
                        onSubmit={submit("staff/project", { id: project.id })}
                      >
                        {input("title", "Title", "text", true, project.title)}
                        {select(
                          "status",
                          "Status",
                          [
                            "Planning",
                            "Design",
                            "Development",
                            "Review",
                            "Launched",
                            "On hold",
                          ],
                          project.status,
                        )}
                        <label>
                          Description
                          <textarea
                            name="description"
                            defaultValue={project.description}
                            maxLength={1800}
                          />
                        </label>
                        <button className="button primary" disabled={busy}>
                          Save status update
                        </button>
                      </form>
                    </details>
                  )}
                </article>
                <div className="workspace-grid">
                  <article className="workspace-card">
                    <h3>Milestones & approvals</h3>
                    {!data.milestones.some(
                      (m) => m.project_id === project.id,
                    ) && (
                      <p>
                        Milestones will appear here when your team adds them.
                      </p>
                    )}
                    {data.milestones
                      .filter((m) => m.project_id === project.id)
                      .map((m) => (
                        <div className="workspace-item" key={m.id}>
                          <strong>{m.title}</strong>
                          <span>{m.status}</span>
                          {m.client_feedback && (
                            <p>Client feedback: {m.client_feedback}</p>
                          )}
                          {staff && (
                            <details>
                              <summary>Update milestone</summary>
                              <form
                                className="hub-form"
                                onSubmit={submit("staff/milestone", {
                                  id: m.id,
                                  project_id: project.id,
                                })}
                              >
                                {input("title", "Title", "text", true, m.title)}
                                {select(
                                  "status",
                                  "Status",
                                  [
                                    "Planned",
                                    "In progress",
                                    "Ready for approval",
                                  ],
                                  [
                                    "Planned",
                                    "In progress",
                                    "Ready for approval",
                                  ].includes(m.status ?? "")
                                    ? m.status
                                    : "Planned",
                                )}
                                <button
                                  className="button primary"
                                  disabled={busy}
                                >
                                  Save milestone
                                </button>
                              </form>
                            </details>
                          )}
                          {!staff && m.status === "Ready for approval" && (
                            <form
                              className="hub-form"
                              onSubmit={submit("project/approve", { id: m.id })}
                            >
                              {select("status", "Your decision", [
                                "Approved",
                                "Changes requested",
                              ])}
                              <label>
                                Feedback
                                <textarea name="feedback" maxLength={1800} />
                              </label>
                              <button
                                className="button primary"
                                disabled={busy}
                              >
                                Send decision
                              </button>
                            </form>
                          )}
                        </div>
                      ))}
                    {staff && (
                      <form
                        className="hub-form"
                        onSubmit={submit("staff/milestone", {
                          project_id: project.id,
                        })}
                      >
                        {input("title", "New milestone")}
                        {select("status", "Milestone status", [
                          "Planned",
                          "In progress",
                          "Ready for approval",
                        ])}
                        <button className="button primary" disabled={busy}>
                          Add milestone
                        </button>
                      </form>
                    )}
                  </article>
                  <article className="workspace-card">
                    <h3>Project messages</h3>
                    <div
                      className="hub-transcript"
                      role="log"
                      aria-live="polite"
                    >
                      {data.messages
                        .filter((m) => m.project_id === project.id)
                        .reverse()
                        .map((m) => (
                          <div className="workspace-item" key={m.id}>
                            <strong>
                              {m.sender_id === data.account.id
                                ? "You"
                                : "Project team / client"}
                            </strong>
                            <p>{m.body}</p>
                            <small>{stamp(m.created_at)}</small>
                          </div>
                        ))}
                    </div>
                    <form
                      className="hub-form"
                      onSubmit={submit("project/message", {
                        project_id: project.id,
                      })}
                    >
                      <label>
                        Your message
                        <textarea name="message" required maxLength={4000} />
                      </label>
                      <button className="button primary" disabled={busy}>
                        {iconText("Send message ↗")}
                      </button>
                    </form>
                  </article>
                  <article className="workspace-card">
                    <h3>Private project files</h3>
                    <p>
                      PDF, PNG, JPEG, WebP or text. Up to 4 MiB. Please do not
                      upload credentials or payment details.
                    </p>
                    {data.files
                      .filter((f) => f.project_id === project.id)
                      .map((f) => (
                        <button
                          className="workspace-file"
                          key={f.id}
                          disabled={busy}
                          onClick={async () => {
                            const result = await act("project/download", {
                              id: f.id,
                            });
                            if (result) window.location.assign(result.url);
                          }}
                        >
                          {f.name}{" "}
                          <span>{Math.ceil((f.size ?? 0) / 1024)} KB ↓</span>
                        </button>
                      ))}
                    <form
                      className="hub-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.currentTarget;
                        const payload = new FormData(form);
                        payload.set("project_id", project.id);
                        void act("project/file", payload, form);
                      }}
                    >
                      <label>
                        Upload a file
                        <input
                          type="file"
                          name="file"
                          required
                          accept="application/pdf,image/png,image/jpeg,image/webp,text/plain"
                        />
                      </label>
                      <button className="button primary" disabled={busy}>
                        Upload securely
                      </button>
                    </form>
                  </article>
                  <article className="workspace-card">
                    <h3>Invoices & payments</h3>
                    <p>
                      Tracking only. Payment collection is not connected.
                      Contact your team for approved payment arrangements.
                    </p>
                    {data.invoices
                      .filter((i) => i.project_id === project.id)
                      .map((i) => (
                        <div className="workspace-item" key={i.id}>
                          <strong>{i.label}</strong>
                          <p>
                            {new Intl.NumberFormat(undefined, {
                              style: "currency",
                              currency: i.currency ?? "USD",
                            }).format(
                              (i.amount_minor ?? 0) /
                                10 **
                                  (new Intl.NumberFormat("en", {
                                    style: "currency",
                                    currency: i.currency ?? "USD",
                                  }).resolvedOptions().maximumFractionDigits ??
                                    2),
                            )}{" "}
                            · {i.status}
                          </p>
                          {staff && (
                            <div className="hub-inline-actions">
                              {["Paid", "Unpaid", "Void"].map((status) => (
                                <button
                                  key={status}
                                  disabled={busy}
                                  onClick={() =>
                                    void act("staff/invoice", {
                                      id: i.id,
                                      status,
                                    })
                                  }
                                >
                                  Mark {status}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    {staff && (
                      <form
                        className="hub-form"
                        onSubmit={submit("staff/invoice", {
                          project_id: project.id,
                        })}
                      >
                        {input("label", "Invoice label")}
                        {input(
                          "amount_minor",
                          "Amount in minor units (USD cents)",
                          "number",
                        )}
                        {input(
                          "currency",
                          "Currency code",
                          "text",
                          true,
                          "USD",
                        )}
                        <button className="button primary" disabled={busy}>
                          Add invoice record
                        </button>
                      </form>
                    )}
                  </article>
                </div>
              </>
            )}
          </>
        )}
        {data && tab === "Knowledge" && (
          <>
            <article className="workspace-card">
              <h3>Approved knowledge</h3>
              <p>
                Published answers power both the public FAQ and AI guidance.
                Only add verified services and approved statements.
              </p>
              <form className="hub-form" onSubmit={submit("staff/faq")}>
                {input("question", "Question")}
                <label>
                  Approved answer
                  <textarea name="answer" required maxLength={1800} />
                </label>
                <label className="presence-toggle">
                  <input name="published" type="checkbox" />
                  Publish answer
                </label>
                <button className="button primary" disabled={busy}>
                  Add knowledge
                </button>
              </form>
            </article>
            <div className="workspace-grid">
              {data.faqs?.map((f) => (
                <article className="workspace-card" key={f.id}>
                  <form
                    className="hub-form"
                    onSubmit={submit("staff/faq", { id: f.id })}
                  >
                    {input("question", "Question", "text", true, f.question)}
                    <label>
                      Approved answer
                      <textarea
                        name="answer"
                        required
                        maxLength={1800}
                        defaultValue={f.answer}
                      />
                    </label>
                    <label className="presence-toggle">
                      <input
                        name="published"
                        type="checkbox"
                        defaultChecked={f.published}
                      />
                      Published
                    </label>
                    <button className="button primary" disabled={busy}>
                      Save knowledge
                    </button>
                  </form>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
