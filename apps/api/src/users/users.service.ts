import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as slugify from 'slugify';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async getTenant(tenantId: string) {
    return this.prisma.tenant.findUnique({ where: { id: tenantId } });
  }

  async createWithTenant(data: { name: string; email: string; passwordHash: string; tenantName: string; role?: string }) {
    const slug = slugify.default(data.tenantName, { lower: true }) + '-' + Date.now();
    
    return this.prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: { name: data.tenantName, slug, plan: 'free' },
      });

      await tx.pipeline.create({
        data: {
          tenantId: tenant.id,
          name: 'Pipeline Padrão',
          isDefault: true,
          stages: {
            create: [
              { name: 'Novo', orderIndex: 0 },
              { name: 'Contato Feito', orderIndex: 1 },
              { name: 'Proposta Enviada', orderIndex: 2 },
              { name: 'Negciação', orderIndex: 3 },
              { name: 'Fechado', orderIndex: 4, isWon: true },
              { name: 'Perdido', orderIndex: 5, isLost: true },
            ],
          },
        },
      });

      const user = await tx.user.create({
        data: {
          tenantId: tenant.id,
          name: data.name,
          email: data.email,
          passwordHash: data.passwordHash,
          role: data.role || 'admin',
        },
      });

      return { user, tenant };
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.user.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } });
  }

  async update(id: string, data: any) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.prisma.user.delete({ where: { id } });
  }
}
