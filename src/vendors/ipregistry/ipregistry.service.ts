import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, Observable } from 'rxjs';
import { IpInfo } from '../../ipinfo/models/ipinfo.model';
import { RatelimitterService } from '../../ratelimitter/ratelimiter.service';
import SlidingWindowRateLimiter from 'sliding-window-rate-limiter';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class IpRegistryService {
  private ipInfo: IpInfo;
  private static readonly IP_REGISTRY_REQUEST_LIMIT: number =
    parseInt(process.env.IP_REGISTRY_REQUEST_LIMIT) || 100;
  // @ts-ignore
  private readonly limiter = SlidingWindowRateLimiter.createLimiter({
    interval: parseInt(process.env.IP_REGISTRY_RATE_LIMIT_TIME) || 60 * 1000,
    redis: this.redisClient,
  });
  constructor(
    private readonly httpService: HttpService,
    private readonly rateLimiter: RatelimitterService,
    @InjectRedis() private readonly redisClient: Redis,
  ) {}
  async getSingleIpInfo(ipAddress: string): Promise<Observable<IpInfo>> {
    Logger.log('Calling Vendor Ip Registry');
    Logger.log('Checking RateLimiting');
    const limitReached = await this.rateLimiter.isOverLimit(
      'vendor:ip-registry',
      this.limiter,
      IpRegistryService.IP_REGISTRY_REQUEST_LIMIT,
    );
    if (limitReached) {
      throw new HttpException(
        'Limit Reached for IP Registry',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    return this.httpService
      .get(`${process.env.IP_REGISTRY_URL}/${ipAddress}`, {
        params: {
          key: process.env.IP_REGISTRY_API_KEY,
        },
      })
      .pipe(
        map((response) => response.data),
        map(
          (data) =>
            (this.ipInfo = new IpInfo(
              data.location.country.name,
              data.location.country.code,
              ipAddress,
            )),
        ),
      );
  }
}
