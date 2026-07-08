const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitOptions {
  limit: number;      // Maximum number of requests allowed
  windowMs: number;   // Window size in milliseconds
}

export function isRateLimited(
  key: string,
  options: RateLimitOptions = { limit: 100, windowMs: 15 * 60 * 1000 }
): { limited: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    // Fresh window
    const newRecord = {
      count: 1,
      resetTime: now + options.windowMs,
    };
    rateLimitMap.set(key, newRecord);
    return { limited: false, remaining: options.limit - 1, reset: newRecord.resetTime };
  }

  if (record.count >= options.limit) {
    return { limited: true, remaining: 0, reset: record.resetTime };
  }

  record.count += 1;
  return { limited: false, remaining: options.limit - record.count, reset: record.resetTime };
}
