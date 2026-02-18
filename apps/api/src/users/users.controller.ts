import { Controller, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser, CurrentTenant } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser('userId') userId: string) {
    const user = await this.usersService.findById(userId);
    const { passwordHash, ...result } = user;
    return result;
  }

  @Get()
  async findAll(@CurrentTenant() tenantId: string) {
    const users = await this.usersService.findAll(tenantId);
    return users.map(({ passwordHash, ...user }) => user);
  }

  @Put('me')
  async updateMe(
    @CurrentUser('userId') userId: string,
    @Body() data: any,
  ) {
    const user = await this.usersService.update(userId, data);
    const { passwordHash, ...result } = user;
    return result;
  }
}
