import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom, map, Observable, tap } from 'rxjs';
import { IpInfo } from './models/ipinfo.model';
import { IpStackService } from '../vendors/ipstack/ipstack.service';
import { IpRegistryService } from '../vendors/ipregistry/ipregistry.service';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class IpInfoService {
  constructor(
    private readonly ipStackService: IpStackService,
    private readonly ipRegistryService: IpRegistryService,
    @InjectRedis() private readonly redisClient: Redis,
  ) {}
  async getSingleIpInfo(ipAddress: string): Promise<IpInfo> {
    const cacheResponse = await this.redisClient.get(ipAddress);
    if (cacheResponse) {
      const ipInformation: IpInfo = JSON.parse(cacheResponse);
      Logger.log('Getting data from cache!');
      return ipInformation;
    }
    let ipInformation$: Observable<IpInfo>;
    try {
      ipInformation$ = await this.ipRegistryService.getSingleIpInfo(ipAddress);
    } catch (error) {
      try {
        ipInformation$ = await this.ipStackService.getSingleIpInfo(ipAddress);
      } catch (error) {
        Logger.error(error);
        throw new HttpException(
          'Service is Not available, Please try after sometime',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
    }

    return firstValueFrom(
      ipInformation$.pipe(
        catchError((err) => {
          Logger.error(err);
          throw new HttpException(
            'Service is Not available, Please try after sometime',
            HttpStatus.SERVICE_UNAVAILABLE,
          );
        }),
        tap((ipInfo) =>
          this.redisClient.set(
            ipAddress,
            JSON.stringify(ipInfo),
            'EX',
            process.env.IP_ADDRESS_CACHE_TTL,
          ),
        ),
        map((ipInfo) => ipInfo),
      ),
    );
  }
}
