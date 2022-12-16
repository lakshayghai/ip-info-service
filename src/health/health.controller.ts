import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('/health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}
  @Get()
  getAppHealth(): string {
    return this.healthService.getAppHealth();
  }
}
