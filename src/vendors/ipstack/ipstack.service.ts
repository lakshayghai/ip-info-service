import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, Observable, tap } from 'rxjs';
import { IpInfo } from '../../ipinfo/models/ipinfo.model';
import SlidingWindowRateLimiter from 'sliding-window-rate-limiter';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { RatelimitterService } from '../../ratelimitter/ratelimiter.service';

@Injectable()
export class IpStackService {
  private ipInfo: IpInfo;
  private static readonly IP_STACK_REQUEST_LIMIT: number =
    parseInt(process.env.IP_STACK_REQUEST_LIMIT) || 100;
  // @ts-ignore
  private readonly limiter = SlidingWindowRateLimiter.createLimiter({
    interval: parseInt(process.env.IP_STACK_RATE_LIMIT_TIME) || 60 * 1000,
    redis: this.redisClient,
  });
  constructor(
    private readonly httpService: HttpService,
    @InjectRedis() private readonly redisClient: Redis,
    private readonly rateLimiter: RatelimitterService,
  ) {}
  async getSingleIpInfo(ipAddress: string): Promise<Observable<IpInfo>> {
    Logger.log('Calling Vendor Ip Stack');
    Logger.log('Checking RateLimiting');
    const limitReached = await this.rateLimiter.isOverLimit(
      'vendor:ip-stack',
      this.limiter,
      IpStackService.IP_STACK_REQUEST_LIMIT,
    );
    if (limitReached) {
      throw new HttpException(
        'Limit Reached for IP Stack',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    return this.httpService
      .get(`${process.env.IP_STACK_URL}/${ipAddress}`, {
        params: {
          access_key: process.env.IP_STACK_API_KEY,
        },
      })
      .pipe(
        map((response) => response.data),
        map(
          (data) =>
            (this.ipInfo = {
              countryName: data.country_name,
              countryCode: data.country_code,
              ipAddress,
            }),
        ),
      );
  }
}
