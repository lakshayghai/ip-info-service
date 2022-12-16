import { RedisSlidingWindowRateLimiter } from 'sliding-window-rate-limiter';

export class RatelimitterService {
  async isOverLimit(
    key: string,
    limiter: RedisSlidingWindowRateLimiter,
    limit: number,
  ): Promise<boolean> {
    const checkLimit = await limiter.check(key, limit);
    const { usage } = checkLimit;
    if (usage >= limit) {
      return true;
    }
    await limiter.reserve(key, limit);
    return false;
  }
}
