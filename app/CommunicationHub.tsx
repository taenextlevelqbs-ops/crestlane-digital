"use client";
import { iconText } from "./StudioIcons";
import { useEffect, useRef, useState, type FormEvent } from "react";
type Mode = "chat" | "quote" | "booking" | "assistant";
type Config = {
  configured: boolean;
  online: boolean;
  ai: boolean;
  faqs: { question: string; answer: string }[];
  urls: Record<string, string>;
};
type Message = { id: string; sender: string; body: string; created_at: string };
const initial: Config = {
  configured: false,
  online: false,
  ai: false,
  faqs: [],
  urls: {},
};
function Glyph({ type }: { type: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      <path
        d={
          type === "call"
            ? "M5 3h4l2 5-3 2c1 3 3 5 6 6l2-3 5 2v4c0 4-7 2-12-3S1 3 5 3Z"
            : type === "email"
              ? "M3 5h18v14H3zM3 5l9 7 9-7"
            : type === "booking"
              ? "M4 5h16v16H4zM8 2v6m8-6v6M4 11h16m-11 5h6"
              : type === "quote"
                ? "M6 3h12v18H6zM9 8h6m-6 4h6m-6 4h4"
                : type === "assistant"
                  ? "m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"
                  : "M3 4h18v13H9l-6 4V4Zm5 6h8m-8 3h5"
        }
      />
    </svg>
  );
}
export default function CommunicationHub() {
  const [config, setConfig] = useState(initial),
    [mode, setMode] = useState<Mode | null>(null),
    [feedback, setFeedback] = useState(""),
    [busy, setBusy] = useState(false),
    [step, setStep] = useState(0),
    [saved, setSaved] = useState(false),
    [messages, setMessages] = useState<Message[]>([]),
    [started, setStarted] = useState(false),
    [answer, setAnswer] = useState("");
  const panel = useRef<HTMLDivElement>(null),
    lock = useRef(false);
  const [draft, setDraft] = useState<Record<string, string>>({
    projectType: "Website",
    budget: "Help me estimate",
    timeline: "Flexible",
    duration: "15",
    format: "Phone",
    timezone: "UTC",
  });
  const refresh = async () => {
    try {
      const r = await fetch("/api/platform/config");
      if (r.ok) setConfig(await r.json());
    } catch {}
  };
  useEffect(() => {
    const first = setTimeout(() => {
      void refresh();
      setDraft((d) => ({
        ...d,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }));
    }, 0);
    const timer = setInterval(() => {
      if (!document.hidden) void refresh();
    }, 30000);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, []);
  useEffect(() => {
    if (mode !== "chat") return;
    let live = true;
    const read = async () => {
      try {
        const r = await fetch("/api/platform/chat");
        if (r.ok && live) {
          setMessages((await r.json()).messages);
          setStarted(true);
        }
      } catch {}
    };
    void read();
    const timer = setInterval(() => {
      if (!document.hidden) void read();
    }, 5000);
    return () => {
      live = false;
      clearInterval(timer);
    };
  }, [mode]);
  function open(value: Mode) {
    setMode(value);
    setFeedback("");
    setSaved(false);
    setTimeout(() => {
      panel.current?.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "center",
      });
      panel.current?.focus();
    }, 0);
  }
  async function send(path: string, payload: unknown) {
    if (lock.current) return null;
    lock.current = true;
    setBusy(true);
    setFeedback("");
    try {
      const r = await fetch(`/api/platform/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(25000),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message);
      return data;
    } catch (e) {
      setFeedback(
        e instanceof Error
          ? e.message
          : "We could not confirm acceptance. Please contact us before retrying.",
      );
      return null;
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fields = Object.fromEntries(new FormData(form));
    if (mode === "quote" || mode === "booking") {
      const result = await send("lead", {
        ...draft,
        ...fields,
        kind: mode === "quote" ? "quote" : "consultation",
      });
      if (result) {
        setSaved(true);
        setFeedback(
          `${result.message} Reference: ${result.reference}${result.notification !== "accepted" ? " Your request is saved, but email notification is not confirmed." : ""}${mode === "booking" && result.confirmation !== "accepted" ? " Your confirmation email is not confirmed." : ""}`,
        );
      }
    } else if (mode === "chat") {
      const result = await send(
        started ? "chat/message" : "chat/start",
        fields,
      );
      if (result) {
        setStarted(true);
        const r = await fetch("/api/platform/chat");
        if (r.ok) setMessages((await r.json()).messages);
        form.reset();
        setFeedback("Message saved. Our team can reply here.");
      }
    } else {
      const result = await send("assistant", fields);
      if (result) setAnswer(result.answer);
    }
  }
  const field = (
    name: string,
    label: string,
    type = "text",
    required = false,
  ) => (
    <label>
      {label}
      <input
        name={name}
        type={type}
        maxLength={
          name === "email"
            ? 254
            : name === "name"
              ? 100
              : name === "phone"
                ? 40
                : name === "business"
                  ? 160
                  : name === "website"
                    ? 500
                    : 200
        }
        required={required}
        value={draft[name] ?? ""}
        onChange={(e) => setDraft({ ...draft, [name]: e.target.value })}
        autoComplete={
          name === "name"
            ? "name"
            : name === "email"
              ? "email"
              : name === "phone"
                ? "tel"
                : "off"
        }
      />
    </label>
  );
  return (
    <section
      className="communication-section wrap"
      id="connect"
      tabIndex={-1}
      aria-labelledby="connect-title"
    >
      <div className="hub-heading">
        <div>
          <p className="eyebrow">05 / LET’S CONNECT</p>
          <h2 id="connect-title">
            Let’s build
            <br />
            <em>something great.</em>
          </h2>
        </div>
        <div>
          <p>
            Big idea or quick question, there’s a comfortable way to start.
            Choose what works for you.
          </p>
          <span className="hub-presence">
            <i className={config.online ? "available" : ""} />
            {config.online
              ? "A team member is available"
              : "Leave a message. We’ll respond when available."}
          </span>
        </div>
      </div>
      <div className="hub-priority-contact" aria-label="Call or email Crestlane">
        <a href="tel:+17034314468"><Glyph type="call" /><div><span>LET’S TALK</span><strong>Call us</strong><small>(703) 431-4468</small></div><span className="contact-action-arrow">{iconText("↗")}</span></a>
        <a href="mailto:sales@crestlanedigital.com"><Glyph type="email" /><div><span>START A CONVERSATION</span><strong>Email us</strong><small>sales@crestlanedigital.com</small></div><span className="contact-action-arrow">{iconText("↗")}</span></a>
      </div>
      <div className="hub-cards">
        <button onClick={() => open("chat")} className="hub-card hub-featured">
          <Glyph type="chat" />
          <span className="hub-kicker">A REAL CONVERSATION</span>
          <h3>Message our team</h3>
          <p>
            {config.online
              ? "Start a live conversation."
              : "Send a message, even while we’re away."}
          </p>
          <span className="hub-card-action">{iconText("Open chat ↗")}</span>
        </button>
        <button onClick={() => open("quote")} className="hub-card">
          <Glyph type="quote" />
          <span className="hub-kicker">FROM IDEA TO POSSIBILITY</span>
          <h3>Tell us your vision</h3>
          <p>A guided project brief. No guesswork, no fixed price promises.</p>
          <span className="hub-card-action">
            {iconText("Build your quote request ↗")}
          </span>
        </button>
        <button onClick={() => open("booking")} className="hub-card">
          <Glyph type="booking" />
          <span className="hub-kicker">LET’S TALK IT THROUGH</span>
          <h3>Book a call</h3>
          <p>Request a free 15- or 30-minute consultation.</p>
          <span className="hub-card-action">
            {iconText("Find your next step ↗")}
          </span>
        </button>
        <button onClick={() => open("assistant")} className="hub-card">
          <Glyph type="assistant" />
          <span className="hub-kicker">A LITTLE GUIDANCE</span>
          <h3>Ask Crestlane</h3>
          <p>Explore our services and get help shaping your project.</p>
          <span className="hub-card-action">
            {config.ai ? "Talk to our AI assistant" : "Explore answers"}{" "}
            {iconText("↗")}
          </span>
        </button>
      </div>
      <div className="hub-direct">

        <a href="sms:+17034314468">
          <Glyph type="chat" />
          Text us <span>{iconText("Send a quick message ↗")}</span>
        </a>

        <button onClick={() => open("booking")}>
          <Glyph type="booking" />
          Video consultation{" "}
          <span>{iconText("Google Meet or Zoom request ↗")}</span>
        </button>
        <a href="/portal">
          <Glyph type="quote" />
          Client portal <span>{iconText("Your project, connected ↗")}</span>
        </a>
      </div>
      {Object.keys(config.urls).some((k) => k !== "booking") && (
        <div className="hub-social">
          Message us on{" "}
          {Object.entries(config.urls)
            .filter(([k]) => k !== "booking")
            .map(([k, v]) => (
              <a key={k} href={v} target="_blank" rel="noopener noreferrer">
                {k === "facebook"
                  ? "Facebook Messenger"
                  : k === "whatsapp"
                    ? "WhatsApp"
                    : "Instagram"}{" "}
                ↗
              </a>
            ))}
        </div>
      )}
      {mode && (
        <div
          className="hub-panel"
          ref={panel}
          tabIndex={-1}
          aria-labelledby="hub-panel-title"
        >
          <div className="hub-panel-top">
            <p className="eyebrow">
              CRESTLANE /{" "}
              {mode === "assistant"
                ? config.ai
                  ? "AI ASSISTANT"
                  : "SERVICE GUIDE"
                : mode}
            </p>
            <button
              onClick={() => setMode(null)}
              aria-label="Close conversation panel"
            >
              Close ×
            </button>
          </div>
          <h3 id="hub-panel-title">
            {mode === "quote"
              ? "A better project starts with a clear brief."
              : mode === "booking"
                ? "Make time for what’s next."
                : mode === "chat"
                  ? "You bring the idea. We’ll listen."
                  : "Find the right direction."}
          </h3>
          {!config.configured && mode !== "assistant" && (
            <p className="hub-notice">
              This online service is being connected. You can still{" "}
              <a href="mailto:sales@crestlanedigital.com">email us</a>, call or
              text. Submissions are not saved until the service is connected.
            </p>
          )}
          {mode === "assistant" && (
            <>
              <p className="hub-muted">
                {config.ai
                  ? "AI guidance may need confirmation from our team."
                  : "Our service guide works without AI. Explore these answers or send your project brief."}
              </p>
              <div className="hub-faqs">
                {config.faqs.map((f) => (
                  <details key={f.question}>
                    <summary>{f.question}</summary>
                    <p>{f.answer}</p>
                  </details>
                ))}
              </div>
              <form onSubmit={submit} className="hub-form">
                <label>
                  Your question
                  <textarea
                    name="question"
                    required
                    maxLength={1200}
                    rows={3}
                  />
                </label>
                <button className="button primary" disabled={busy}>
                  {busy ? "Thinking…" : iconText("Ask a question ↗")}
                </button>
              </form>
              {answer && (
                <p className="hub-answer" role="status">
                  {answer}
                </p>
              )}
              <div className="hub-inline-actions">
                <button onClick={() => open("quote")}>
                  {iconText("Share project requirements ↗")}
                </button>
                <button onClick={() => open("booking")}>
                  {iconText("Request a consultation ↗")}
                </button>
                <button onClick={() => open("chat")}>
                  {iconText("Talk to a human ↗")}
                </button>
              </div>
            </>
          )}
          {mode === "chat" && (
            <>
              <p className="hub-muted">
                {config.online
                  ? "A staff member recently marked themselves available. Replies may take a moment."
                  : "Our team is currently away. Leave a message and return in this browser for replies."}{" "}
                Chat history is retained in this browser for 30 days. Do not use
                a shared device.
              </p>
              <div
                className="hub-transcript"
                role="log"
                aria-live="polite"
                aria-label="Conversation"
              >
                {messages.map((m) => (
                  <div className={`hub-message ${m.sender}`} key={m.id}>
                    <strong>
                      {m.sender === "staff" ? "Crestlane team" : "You"}
                    </strong>
                    <p>{m.body}</p>
                    <small>{new Date(m.created_at).toLocaleString()}</small>
                  </div>
                ))}
              </div>
              <form className="hub-form" onSubmit={submit}>
                {!started && (
                  <div className="hub-fields">
                    <label>
                      Your name
                      <input
                        name="name"
                        required
                        maxLength={100}
                        autoComplete="name"
                      />
                    </label>
                    <label>
                      Email address
                      <input
                        name="email"
                        required
                        maxLength={254}
                        type="email"
                        autoComplete="email"
                      />
                    </label>
                  </div>
                )}
                <label>
                  {started ? "Your next message" : "How can we help?"}
                  <textarea name="message" required maxLength={4000} rows={3} />
                </label>
                <label className="contact-trap" aria-hidden="true">
                  Leave empty
                  <input name="companyFax" tabIndex={-1} autoComplete="off" />
                </label>
                <button
                  className="button primary"
                  disabled={busy || !config.configured}
                >
                  {busy ? "Saving…" : iconText("Send message ↗")}
                </button>
              </form>
            </>
          )}
          {mode === "booking" && (
            <>
              {config.urls.booking && (
                <p className="hub-booking-link">
                  <a
                    className="button primary"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={config.urls.booking}
                  >
                    {iconText("See calendar availability ↗")}
                  </a>
                  <span>
                    Booking is confirmed only by the scheduling provider.
                  </span>
                </p>
              )}
              <p className="hub-muted">
                Or request a time below. We’ll check availability before
                confirming. Video meetings require an actual meeting link from
                our team.
              </p>
            </>
          )}
          {(mode === "quote" || mode === "booking") && (
            <form className="hub-form" onSubmit={submit}>
              <fieldset disabled={busy || saved}>
                <legend className="sr-only">
                  {mode === "quote"
                    ? "Project quote request"
                    : "Consultation request"}
                </legend>
                {mode === "quote" && (
                  <>
                    <ol className="hub-steps" aria-label="Quote progress">
                      {["Your business", "Your vision", "The details"].map(
                        (label, i) => (
                          <li
                            key={label}
                            aria-current={step === i ? "step" : undefined}
                          >
                            <span>{i + 1}</span>
                            {label}
                          </li>
                        ),
                      )}
                    </ol>
                    <div className="hub-fields">
                      {step === 0 && (
                        <>
                          {field("name", "Your name *", "text", true)}
                          {field("email", "Email address *", "email", true)}
                          {field("phone", "Phone number", "tel")}
                          {field("business", "Business name")}
                          <label>
                            Project type
                            <select
                              name="projectType"
                              value={draft.projectType}
                              onChange={(e) =>
                                setDraft({
                                  ...draft,
                                  projectType: e.target.value,
                                })
                              }
                            >
                              {[
                                "Website",
                                "Online store",
                                "Software / portal",
                                "Automation",
                                "Security / support",
                                "Not sure",
                              ].map((v) => (
                                <option key={v}>{v}</option>
                              ))}
                            </select>
                          </label>
                        </>
                      )}
                      {step === 1 && (
                        <>
                          {field(
                            "website",
                            "Existing website (https://…)",
                            "url",
                          )}
                          <label>
                            Features you need
                            <textarea
                              name="features"
                              maxLength={900}
                              value={draft.features ?? ""}
                              onChange={(e) =>
                                setDraft({ ...draft, features: e.target.value })
                              }
                              placeholder="Booking, online store, client portal…"
                            />
                          </label>
                          <label>
                            Design preferences
                            <textarea
                              name="design"
                              maxLength={900}
                              value={draft.design ?? ""}
                              onChange={(e) =>
                                setDraft({ ...draft, design: e.target.value })
                              }
                              placeholder="Style, colors or websites you admire"
                            />
                          </label>
                        </>
                      )}
                      {step === 2 && (
                        <>
                          <label>
                            Estimated budget
                            <select
                              name="budget"
                              value={draft.budget}
                              onChange={(e) =>
                                setDraft({ ...draft, budget: e.target.value })
                              }
                            >
                              {[
                                "Help me estimate",
                                "Under $1,500",
                                "$1,500–$3,000",
                                "$3,000–$6,000",
                                "$6,000–$10,000",
                                "$10,000+",
                              ].map((v) => (
                                <option key={v}>{v}</option>
                              ))}
                            </select>
                          </label>
                          <label>
                            Desired timeline
                            <select
                              name="timeline"
                              value={draft.timeline}
                              onChange={(e) =>
                                setDraft({ ...draft, timeline: e.target.value })
                              }
                            >
                              {[
                                "Flexible",
                                "As soon as possible",
                                "Within 1 month",
                                "Within 1–3 months",
                                "Within 3–6 months",
                              ].map((v) => (
                                <option key={v}>{v}</option>
                              ))}
                            </select>
                          </label>
                          <label className="hub-wide">
                            Anything else we should know? *
                            <textarea
                              name="description"
                              required
                              maxLength={1800}
                              rows={4}
                              value={draft.description ?? ""}
                              onChange={(e) =>
                                setDraft({
                                  ...draft,
                                  description: e.target.value,
                                })
                              }
                            />
                          </label>
                        </>
                      )}
                    </div>
                    <p className="hub-muted">
                      This is a request for a tailored proposal. Budget ranges
                      are your preferences, not Crestlane prices.
                    </p>
                  </>
                )}
                {mode === "booking" && (
                  <div className="hub-fields">
                    {field("name", "Your name *", "text", true)}
                    {field("email", "Email address *", "email", true)}
                    {field(
                      "phone",
                      draft.format === "Phone"
                        ? "Phone number *"
                        : "Phone number",
                      "tel",
                      draft.format === "Phone",
                    )}
                    <label>
                      Consultation length
                      <select
                        name="duration"
                        value={draft.duration}
                        onChange={(e) =>
                          setDraft({ ...draft, duration: e.target.value })
                        }
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                      </select>
                    </label>
                    {field(
                      "preferred",
                      "Preferred dates and times *",
                      "text",
                      true,
                    )}
                    {field("timezone", "Your time zone *", "text", true)}
                    <label>
                      How would you like to meet?
                      <select
                        name="format"
                        value={draft.format}
                        onChange={(e) =>
                          setDraft({ ...draft, format: e.target.value })
                        }
                      >
                        {["Phone", "Google Meet", "Zoom"].map((v) => (
                          <option key={v}>{v}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      What would you like to discuss?
                      <textarea name="description" maxLength={1800} rows={3} />
                    </label>
                  </div>
                )}
                <label className="contact-trap" aria-hidden="true">
                  Leave empty
                  <input name="companyFax" tabIndex={-1} autoComplete="off" />
                </label>
                <div className="hub-inline-actions">
                  {mode === "quote" && step > 0 && (
                    <button type="button" onClick={() => setStep(step - 1)}>
                      {iconText("← Back")}
                    </button>
                  )}
                  {mode === "quote" && step < 2 ? (
                    <button
                      className="button primary"
                      type="button"
                      onClick={(e) => {
                        if (e.currentTarget.form?.reportValidity())
                          setStep(step + 1);
                      }}
                    >
                      {iconText("Continue →")}
                    </button>
                  ) : (
                    <button
                      className="button primary"
                      disabled={busy || saved || !config.configured}
                    >
                      {busy
                        ? "Saving…"
                        : saved
                          ? "Request saved"
                          : mode === "quote"
                            ? iconText("Send quote request ↗")
                            : iconText("Request consultation ↗")}
                    </button>
                  )}
                </div>
              </fieldset>
            </form>
          )}
          <p className="hub-feedback" role="status" aria-live="polite">
            {feedback}
          </p>
          <p className="hub-privacy">
            We use your details to respond to your request. Please don’t share
            passwords, payment details or sensitive personal information.
          </p>
        </div>
      )}
    </section>
  );
}
