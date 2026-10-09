import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { ipAddress } from "@vercel/functions";
import { createContactHandler, createLimiter } from "../../../lib/contact-server";

export const runtime = "nodejs";
const localLimiter = createLimiter(10);
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
  : null;
const rateLimiter = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  prefix: "crestlane:contact",
  analytics: false,
}) : null;

export const POST = createContactHandler({
  env: process.env,
  allow: async (request) => {
    if (rateLimiter) {
      const ip = ipAddress(request);
      if (!ip) return "unavailable";
      try { return (await rateLimiter.limit(ip)).success; }
      catch { return "unavailable"; }
    }
    if (process.env.NODE_ENV === "production") return "unavailable";
    return localLimiter();
  },
});
