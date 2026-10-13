import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { identity } from "../../lib/platform/server";
import { PlatformError } from "../../lib/platform/validation";
import Workspace from "../portal/Workspace";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Studio management",
  robots: { index: false, follow: false },
  alternates: { canonical: "/studio" },
};
export default async function Studio() {
  try {
    await identity(true);
  } catch (error) {
    if (error instanceof PlatformError && error.status === 401)
      redirect("/portal/login");
    if (error instanceof PlatformError && error.status === 403)
      redirect("/portal");
    return (
      <main className="wrap workspace-login">
        <h1>Studio being connected</h1>
        <p>
          Secure staff tools require the Crestlane database. Contact your
          administrator.
        </p>
        <Link href="/">Return home</Link>
      </main>
    );
  }
  return <Workspace staff />;
}
