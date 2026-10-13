import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { identity } from "../../lib/platform/server";
import { PlatformError } from "../../lib/platform/validation";
import Workspace from "./Workspace";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Your workspace",
  robots: { index: false, follow: false },
  alternates: { canonical: "/portal" },
};
export default async function Portal() {
  try {
    await identity();
  } catch (error) {
    if (error instanceof PlatformError && [401, 403].includes(error.status))
      redirect("/portal/login");
    return (
      <main className="wrap workspace-login">
        <h1>Workspace being connected</h1>
        <p>
          Your private workspace is not available yet. Please contact Crestlane.
        </p>
        <Link href="/">Return home</Link>
      </main>
    );
  }
  return <Workspace staff={false} />;
}
