import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { DealsService } from './deals.service';
import { CurrentTenant } from '../common/decorators/current-tenant.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('deals')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('deals')
export class DealsController {
  constructor(private dealsService: DealsService) {}

  @Get()
  findAll(@CurrentTenant() tenantId: string, @Query('pipelineId') pipelineId?: string, @Query('stageId') stageId?: string) {
    return this.dealsService.findAll(tenantId, { pipelineId, stageId });
  }

  @Get('stats')
  getStats(@CurrentTenant() tenantId: string) {
    return this.dealsService.getStats(tenantId);
  }

  @Get(':id')
  findById(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.dealsService.findById(tenantId, id);
  }

  @Post()
  create(@CurrentTenant() tenantId: string, @Body() data: any) {
    return this.dealsService.create(tenantId, data);
  }

  @Put(':id')
  update(@CurrentTenant() tenantId: string, @Param('id') id: string, @Body() data: any) {
    return this.dealsService.update(tenantId, id, data);
  }

  @Put(':id/move/:stageId')
  moveStage(@CurrentTenant() tenantId: string, @Param('id') id: string, @Param('stageId') stageId: string) {
    return this.dealsService.moveStage(tenantId, id, stageId);
  }

  @Delete(':id')
  delete(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.dealsService.delete(tenantId, id);
  }
}
