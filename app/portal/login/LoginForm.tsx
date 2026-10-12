"use client";
import { iconText } from "../../StudioIcons";
import { useState, type FormEvent } from "react";
export default function LoginForm() {
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const r = await fetch("/api/platform/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message);
      window.location.assign(data.redirect);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="hub-form" onSubmit={submit}>
      <label>
        Email address
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          maxLength={254}
        />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={256}
        />
      </label>
      <button className="button primary" disabled={busy}>
        {busy ? "Signing in…" : iconText("Sign in securely ↗")}
      </button>
      <p role="status">{message}</p>
    </form>
  );
}
