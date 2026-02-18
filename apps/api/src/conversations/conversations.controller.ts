import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CurrentTenant } from '../common/decorators/current-tenant.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('conversations')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('conversations')
export class ConversationsController {
  constructor(private conversationsService: ConversationsService) {}

  @Get()
  findAll(
    @CurrentTenant() tenantId: string,
    @Query('status') status?: string,
    @Query('teamId') teamId?: string,
    @Query('assignedUserId') assignedUserId?: string,
  ) {
    return this.conversationsService.findAll(tenantId, { status, teamId, assignedUserId });
  }

  @Get('stats')
  getStats(@CurrentTenant() tenantId: string) {
    return this.conversationsService.getStats(tenantId);
  }

  @Get(':id')
  findById(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.conversationsService.findById(tenantId, id);
  }

  @Post()
  create(@CurrentTenant() tenantId: string, @Body() data: any) {
    return this.conversationsService.create(tenantId, data);
  }

  @Put(':id')
  update(@CurrentTenant() tenantId: string, @Param('id') id: string, @Body() data: any) {
    return this.conversationsService.update(tenantId, id, data);
  }

  @Post(':id/messages')
  addMessage(@Param('id') id: string, @Body() data: any) {
    return this.conversationsService.addMessage(id, data);
  }

  @Post(':id/assign')
  assign(@CurrentTenant() tenantId: string, @Param('id') id: string, @Body('userId') userId: string) {
    return this.conversationsService.assign(tenantId, id, userId);
  }

  @Post(':id/close')
  close(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.conversationsService.close(tenantId, id);
  }

  @Post(':id/tags')
  addTag(@CurrentTenant() tenantId: string, @Param('id') id: string, @Body('tagId') tagId: string) {
    return this.conversationsService.addTag(tenantId, id, tagId);
  }

  @Delete(':id/tags/:tagId')
  removeTag(@Param('id') id: string, @Param('tagId') tagId: string) {
    return this.conversationsService.removeTag(id, tagId);
  }
}
