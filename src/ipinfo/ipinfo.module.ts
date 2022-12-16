import { Module } from '@nestjs/common';
import { IpInfoController } from './ipinfo.controller';
import { IpInfoService } from './ipinfo.service';
import { HttpModule } from '@nestjs/axios';
import { IpRegistryService } from '../vendors/ipregistry/ipregistry.service';
import { IpStackService } from '../vendors/ipstack/ipstack.service';
import { RatelimitterService } from '../ratelimitter/ratelimiter.service';

@Module({
  imports: [HttpModule],
  controllers: [IpInfoController],
  providers: [
    IpInfoService,
    IpRegistryService,
    IpStackService,
    RatelimitterService,
  ],
})
export class IpInfoModule {}
