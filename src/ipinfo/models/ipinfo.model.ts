import { ApiProperty } from '@nestjs/swagger';

export class IpInfo {
  constructor(countryName: string, countryCode: string, ipAddress: string) {
    this.countryName = countryName;
    this.countryCode = countryCode;
    this.ipAddress = ipAddress;
  }
  @ApiProperty()
  countryName: string;
  @ApiProperty()
  countryCode: string;
  @ApiProperty()
  ipAddress: string;
}
