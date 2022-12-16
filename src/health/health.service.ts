import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getAppHealth(): string {
    return 'Health Ok';
  }
}
