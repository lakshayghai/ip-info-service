import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { isIPAddress } from 'ip-address-validator';

export class IpValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    if (isIPAddress(value)) {
      return value;
    }
    throw new BadRequestException(
      'Validation failed',
      'Not a valid Ip Address',
    );
  }
}
