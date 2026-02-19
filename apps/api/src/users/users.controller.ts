import { Controller, Get, Put, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser('userId') userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) return { error: 'User not found' };
    const { passwordHash, ...result } = user as any;
    return result;
  }

  @Get()
  async findAll(@CurrentUser('tenantId') tenantId: string) {
    const users = await this.usersService.findAll(tenantId);
    return users.map((u: any) => ({ ...u, passwordHash: undefined }));
  }

  @Put('me')
  async updateMe(@CurrentUser('userId') userId: string, @Body() data: any) {
    const user = await this.usersService.update(userId, data);
    const { passwordHash, ...result } = user as any;
    return result;
  }
}
