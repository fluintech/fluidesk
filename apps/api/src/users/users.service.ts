import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Tenant, User } from '@prisma/client';
import * as slugify from 'slugify';

interface CreateUserWithTenant {
  name: string;
  email: string;
  passwordHash: string;
  tenantName: string;
  role?: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getTenant(tenantId: string): Promise<Tenant> {
    return this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });
  }

  async createWithTenant(data: CreateUserWithTenant): Promise<{ user: User; tenant: Tenant }> {
    const slug = slugify.default(data.tenantName, { lower: true }) + '-' + Date.now();
    
    return this.prisma.$transaction(async (tx) => {
      // Create tenant
      const tenant = await tx.tenant.create({
        data: {
          name: data.tenantName,
          slug,
          plan: 'free',
        },
      });

      // Create default pipeline for tenant
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

      // Create default subscription (trial)
      await tx.tenantSubscription.create({
        data: {
          tenantId: tenant.id,
          plan: 'free',
          status: 'trial',
          trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      // Create onboarding steps
      const onboardingSteps = [
        { stepKey: 'company_info', stepName: 'Informações da Empresa', stepOrder: 0 },
        { stepKey: 'team_setup', stepName: 'Configurar Times', stepOrder: 1 },
        { stepKey: 'channels', stepName: 'Conectar Canais', stepOrder: 2 },
        { stepKey: 'agents', stepName: 'Configurar Agentes', stepOrder: 3 },
        { stepKey: 'knowledge_base', stepName: 'Base de Conhecimento', stepOrder: 4 },
        { stepKey: 'complete', stepName: 'Pronto para usar!', stepOrder: 5 },
      ];

      await tx.onboardingStep.createMany({
        data: onboardingSteps.map((step) => ({
          ...step,
          tenantId: tenant.id,
        })),
      });

      // Create user
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

  async findAll(tenantId: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
