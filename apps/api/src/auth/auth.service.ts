import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Tenant, User } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  tenantId: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: Omit<User, 'passwordHash'> & { tenant: Tenant };
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new UnauthorizedException('E-mail já cadastrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    
    const { user, tenant } = await this.usersService.createWithTenant({
      name: dto.name,
      email: dto.email,
      passwordHash,
      tenantName: dto.companyName || dto.name,
      role: 'admin',
    });

    const tokens = await this.generateTokens(user, tenant.id);

    return {
      ...tokens,
      user: {
        ...user,
        passwordHash: undefined,
        tenant,
      } as any,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuário inativo');
    }

    const tenant = await this.usersService.getTenant(user.tenantId);
    
    await this.usersService.update(user.id, { lastLoginAt: new Date() });

    const tokens = await this.generateTokens(user, user.tenantId);

    return {
      ...tokens,
      user: {
        ...user,
        passwordHash: undefined,
        tenant,
      } as any,
    };
  }

  async refreshTokens(refreshToken: string): Promise<AuthResponse> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'fluidesk-refresh-secret',
      });

      const user = await this.usersService.findById(payload.sub);
      if (!user || !user.isActive) {
        throw new UnauthorizedException();
      }

      const tenant = await this.usersService.getTenant(user.tenantId);
      const tokens = await this.generateTokens(user, user.tenantId);

      return {
        ...tokens,
        user: {
          ...user,
          passwordHash: undefined,
          tenant,
        } as any,
      };
    } catch {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  private async generateTokens(user: User, tenantId: string): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      tenantId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET || 'fluidesk-secret-key',
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'fluidesk-refresh-secret',
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
