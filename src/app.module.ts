import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { IpInfoModule } from './ipinfo/ipinfo.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    ConfigModule.forRoot({ ignoreEnvFile: true, isGlobal: true }),
    RedisModule.forRoot(
      {
        readyLog: true,
        config: {
          host: process.env.REDIS_HOST,
          port: 6379,
        },
      },
      true,
    ),
    HealthModule,
    IpInfoModule,
    HttpModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
