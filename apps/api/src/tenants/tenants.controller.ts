import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CurrentTenant } from '../common/decorators/current-tenant.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('tenants')
@ApiBearerAuth()
@Controller('tenants')
export class TenantsController {
  constructor(private tenantsService: TenantsService) {}

  @Get('me')
  async getMyTenant(@CurrentTenant() tenantId: string) {
    return this.tenantsService.findById(tenantId);
  }

  @Get('me/subscription')
  async getMySubscription(@CurrentTenant() tenantId: string) {
    return this.tenantsService.getSubscription(tenantId);
  }

  @Get('me/onboarding')
  async getOnboardingSteps(@CurrentTenant() tenantId: string) {
    return this.tenantsService.getOnboardingSteps(tenantId);
  }

  @Put('me/onboarding/:stepKey/complete')
  async completeOnboardingStep(
    @CurrentTenant() tenantId: string,
    @Param('stepKey') stepKey: string,
  ) {
    return this.tenantsService.completeOnboardingStep(tenantId, stepKey);
  }

  @Put('me')
  async updateMyTenant(
    @CurrentTenant() tenantId: string,
    @Body() data: any,
  ) {
    return this.tenantsService.update(tenantId, data);
  }
}
