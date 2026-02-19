import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AiAgentsService } from './ai-agents.service';
import { CurrentTenant } from '../common/decorators/current-tenant.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('ai-agents')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('ai-agents')
export class AiAgentsController {
  constructor(private service: AiAgentsService) {}

  @Get()
  findAll(@CurrentTenant() tenantId: string) {
    return this.service.findAll(tenantId);
  }

  @Get(':id')
  findById(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.service.findById(tenantId, id);
  }

  @Post()
  create(@CurrentTenant() tenantId: string, @Body() data: any) {
    return this.service.create(tenantId, data);
  }

  @Put(':id')
  update(@CurrentTenant() tenantId: string, @Param('id') id: string, @Body() data: any) {
    return this.service.update(tenantId, id, data);
  }

  @Delete(':id')
  delete(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.service.delete(tenantId, id);
  }

  @Get(':id/whatsapp-config')
  getWhatsappConfig(@Param('id') id: string) {
    return this.service.getWhatsappConfig(id);
  }

  @Put(':id/whatsapp-config')
  updateWhatsappConfig(@CurrentTenant() tenantId: string, @Param('id') id: string, @Body() data: any) {
    return this.service.updateWhatsappConfig(tenantId, id, data);
  }
}
