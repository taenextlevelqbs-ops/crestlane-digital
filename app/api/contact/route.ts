import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { ipAddress } from "@vercel/functions";
import { createContactHandler, createLimiter } from "../../../lib/contact-server";
import { getRedisCredentials } from "../../../lib/redis-config";

export const runtime = "nodejs";
const localLimiter = createLimiter(10);
const redisCredentials = getRedisCredentials();
const redis = redisCredentials ? new Redis(redisCredentials) : null;
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
