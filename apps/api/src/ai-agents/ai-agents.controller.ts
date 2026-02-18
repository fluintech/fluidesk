import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AiAgentsService } from './ai-agents.service';
import { CurrentTenant } from '../common/decorators/current-tenant.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('ai-agents')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('ai-agents')
export class AiAgentsController {
  constructor(private aiAgentsService: AiAgentsService) {}

  @Get()
  findAll(@CurrentTenant() tenantId: string) {
    return this.aiAgentsService.findAll(tenantId);
  }

  @Get(':id')
  findById(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.aiAgentsService.findById(tenantId, id);
  }

  @Post()
  create(@CurrentTenant() tenantId: string, @Body() data: any) {
    return this.aiAgentsService.create(tenantId, data);
  }

  @Put(':id')
  update(@CurrentTenant() tenantId: string, @Param('id') id: string, @Body() data: any) {
    return this.aiAgentsService.update(tenantId, id, data);
  }

  @Delete(':id')
  delete(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.aiAgentsService.delete(tenantId, id);
  }

  // WhatsApp Config
  @Get(':id/whatsapp-config')
  getWhatsappConfig(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.aiAgentsService.getWhatsappConfig(tenantId, id);
  }

  @Put(':id/whatsapp-config')
  updateWhatsappConfig(@CurrentTenant() tenantId: string, @Param('id') id: string, @Body() data: any) {
    return this.aiAgentsService.updateWhatsappConfig(tenantId, id, data);
  }

  @Post(':id/whatsapp/generate-qr')
  generateQrCode(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.aiAgentsService.generateQrCode(tenantId, id);
  }

  // Personality
  @Get(':id/personality')
  getPersonality(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.aiAgentsService.getPersonality(tenantId, id);
  }

  @Put(':id/personality')
  updatePersonality(@CurrentTenant() tenantId: string, @Param('id') id: string, @Body() data: any) {
    return this.aiAgentsService.updatePersonality(tenantId, id, data);
  }

  // Tags
  @Get(':id/tags')
  getTags(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.aiAgentsService.getTags(tenantId, id);
  }

  @Post(':id/tags')
  createTag(@CurrentTenant() tenantId: string, @Param('id') id: string, @Body() data: any) {
    return this.aiAgentsService.createTag(tenantId, id, data);
  }

  @Delete(':id/tags/:tagId')
  deleteTag(@CurrentTenant() tenantId: string, @Param('id') id: string, @Param('tagId') tagId: string) {
    return this.aiAgentsService.deleteTag(tenantId, id, tagId);
  }

  // Classification Categories
  @Get(':id/classification-categories')
  getClassificationCategories(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.aiAgentsService.getClassificationCategories(tenantId, id);
  }

  @Post(':id/classification-categories')
  createClassificationCategory(@CurrentTenant() tenantId: string, @Param('id') id: string, @Body() data: any) {
    return this.aiAgentsService.createClassificationCategory(tenantId, id, data);
  }

  // Inactivity Followups
  @Get(':id/followups')
  getInactivityFollowups(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.aiAgentsService.getInactivityFollowups(tenantId, id);
  }

  @Post(':id/followups')
  createInactivityFollowup(@CurrentTenant() tenantId: string, @Param('id') id: string, @Body() data: any) {
    return this.aiAgentsService.createInactivityFollowup(tenantId, id, data);
  }

  @Put(':id/followups/:followupId')
  updateInactivityFollowup(@CurrentTenant() tenantId: string, @Param('id') id: string, @Param('followupId') followupId: string, @Body() data: any) {
    return this.aiAgentsService.updateInactivityFollowup(tenantId, id, followupId, data);
  }

  @Delete(':id/followups/:followupId')
  deleteInactivityFollowup(@Param('id') id: string, @Param('followupId') followupId: string) {
    return this.aiAgentsService.deleteInactivityFollowup(followupId);
  }

  // Metrics
  @Get(':id/metrics')
  getMetrics(@CurrentTenant() tenantId: string, @Param('id') id: string, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.aiAgentsService.getMetrics(
      tenantId, 
      id, 
      startDate ? new Date(startDate) : undefined, 
      endDate ? new Date(endDate) : undefined
    );
  }
}
