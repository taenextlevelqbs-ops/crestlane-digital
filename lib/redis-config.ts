type RedisEnvironment = {
  [key: string]: string | undefined;
  KV_REST_API_URL?: string;
  KV_REST_API_TOKEN?: string;
  UPSTASH_REDIS_REST_URL?: string;
  UPSTASH_REDIS_REST_TOKEN?: string;
};

export type RedisCredentials = { url: string; token: string };

function completePair(url?: string, token?: string): RedisCredentials | null {
  const normalizedUrl = url?.trim();
  const normalizedToken = token?.trim();
  return normalizedUrl && normalizedToken
    ? { url: normalizedUrl, token: normalizedToken }
    : null;
}

export function getRedisCredentials(env: RedisEnvironment = process.env): RedisCredentials | null {
  return completePair(env.KV_REST_API_URL, env.KV_REST_API_TOKEN)
    ?? completePair(env.UPSTASH_REDIS_REST_URL, env.UPSTASH_REDIS_REST_TOKEN);
}
