import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CurrentTenant } from '../common/decorators/current-tenant.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('tenants')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('tenants')
export class TenantsController {
  constructor(private tenantsService: TenantsService) {}

  @Get('me')
  getMyTenant(@CurrentTenant() tenantId: string) {
    return this.tenantsService.findById(tenantId);
  }

  @Get('me/pipelines')
  getPipelines(@CurrentTenant() tenantId: string) {
    return this.tenantsService.getPipelines(tenantId);
  }

  @Put('me')
  updateMyTenant(@CurrentTenant() tenantId: string, @Body() data: any) {
    return this.tenantsService.update(tenantId, data);
  }
}
