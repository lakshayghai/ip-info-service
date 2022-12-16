export class IpInfo {
  constructor(countryName: string, countryCode: string, ipAddress: string) {
    this.countryName = countryName;
    this.countryCode = countryCode;
    this.ipAddress = ipAddress;
  }
  countryName: string;
  countryCode: string;
  ipAddress: string;
}
