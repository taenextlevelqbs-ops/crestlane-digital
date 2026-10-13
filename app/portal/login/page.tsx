import { iconText } from "../../StudioIcons";
import Link from "next/link";
import type { Metadata } from "next";
import LoginForm from "./LoginForm";
export const metadata: Metadata = {
  title: "Client sign in",
  robots: { index: false, follow: false },
  alternates: { canonical: "/portal/login" },
};
export default function Login() {
  return (
    <main className="workspace-login wrap">
      <Link className="eyebrow" href="/">
        {iconText("← CRESTLANE DIGITAL")}
      </Link>
      <div className="login-card">
        <p className="eyebrow">YOUR PROJECT. ONE CONNECTED SPACE.</p>
        <h1>
          Welcome <em>back.</em>
        </h1>
        <p>Sign in to your private Crestlane workspace.</p>
        <LoginForm />
        <p className="hub-muted">
          Accounts are invitation-only. Need access or password recovery?{" "}
          <a href="mailto:sales@crestlanedigital.com">
            Contact your Crestlane team.
          </a>
        </p>
      </div>
    </main>
  );
}
