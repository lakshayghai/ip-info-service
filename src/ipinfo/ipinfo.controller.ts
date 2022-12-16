import { Controller, Get, Param } from '@nestjs/common';
import { IpInfo } from './models/ipinfo.model';
import { IpValidationPipe } from './validation/ipvalidation.pipe';
import { from, Observable } from 'rxjs';
import { IpInfoService } from './ipinfo.service';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Ip Information')
@ApiBadRequestResponse({ description: 'Invalid ipV4 Address' })
@ApiResponse({ status: 503, description: 'Service is Not available ' })
@ApiOkResponse({
  description: 'Ok',
  type: IpInfo,
})
@Controller()
export class IpInfoController {
  constructor(private readonly ipInfoService: IpInfoService) {}
  @Get('/ip/:ipAddress')
  getSingleIpInfo(
    @Param('ipAddress', IpValidationPipe) ipAddress: string,
  ): Observable<IpInfo> {
    return from(this.ipInfoService.getSingleIpInfo(ipAddress));
  }
}
