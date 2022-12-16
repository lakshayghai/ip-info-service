import { Test, TestingModule } from '@nestjs/testing';
import {
  HttpException,
  HttpStatus,
  INestApplication,
  Ip,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { IpInfoService } from '../src/ipinfo/ipinfo.service';
import { firstValueFrom, from, Observable, of } from 'rxjs';
import { IpInfo } from '../src/ipinfo/models/ipinfo.model';

describe('IpInfoController (e2e)', () => {
  let app: INestApplication;
  let service: IpInfoService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    service = moduleFixture.get<IpInfoService>(IpInfoService);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('When No Data is Returned /ip/:ipAddress (GET)', async () => {
    jest.spyOn(service, 'getSingleIpInfo').mockImplementation(() => {
      throw new HttpException('', HttpStatus.SERVICE_UNAVAILABLE);
    });
    const response = await request(app.getHttpServer())
      .get('/ip/108.26.34.76')
      .expect(503);
  });

  it('Ip Information Returned /ip/:ipAddress (GET)', async () => {
    const ipInformation: IpInfo = new IpInfo(
      'United States',
      'US',
      '108.26.34.76',
    );
    jest.spyOn(service, 'getSingleIpInfo').mockImplementation(() => {
      return firstValueFrom(
        of(new IpInfo('United States', 'US', '108.26.34.76')),
      );
    });
    const response = await request(app.getHttpServer())
      .get('/ip/108.26.34.76')
      .expect(200);
    expect(response.text).toBe(JSON.stringify(ipInformation));
  });

  it('Invalid Ipv4 /ip/:ipAddress (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/ip/abcd')
      .expect(400);
  });
});
