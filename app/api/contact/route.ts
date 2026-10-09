import { createContactHandler, createLimiter } from "../../../lib/contact-server";

export const runtime = "nodejs";
export const POST = createContactHandler({ env: process.env, allow: createLimiter() });
