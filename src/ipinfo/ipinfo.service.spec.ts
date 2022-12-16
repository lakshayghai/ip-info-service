// import { Test, TestingModule } from '@nestjs/testing';
// import { IpInfoController } from './ipinfo.controller';
// import { IpInfoService } from './ipinfo.service';
// import { IpInfo } from './models/ipinfo.model';
// import { IpRegistryService } from '../vendors/ipregistry/ipregistry.service';
// import { IpStackService } from '../vendors/ipstack/ipstack.service';
//
// describe('IpInfoService', () => {
//   let ipInfoService: IpInfoService;
//
//   beforeEach(async () => {
//     const app: TestingModule = await Test.createTestingModule({
//       providers: [IpInfoService, IpRegistryService, IpStackService],
//     }).compile();
//
//     ipInfoService = app.get<IpInfoService>(IpInfoService);
//   });
//
//   describe('root', () => {
//     it('should return "Hello World!"', () => {
//       const ipInformation: IpInfo = new IpInfo(
//         'United States',
//         'US',
//         '108.52.25.129',
//       );
//       expect(ipInfoService.getSingleIpInfo('108.52.25.129')).toBe(
//         ipInformation,
//       );
//     });
//   });
// });
