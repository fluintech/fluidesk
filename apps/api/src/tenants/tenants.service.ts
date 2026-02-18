import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async findById(tenantId: string) {
    return this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        tenantSubscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
  }

  async update(tenantId: string, data: any) {
    return this.prisma.tenant.update({
      where: { id: tenantId },
      data,
    });
  }

  async getSubscription(tenantId: string) {
    const subscription = await this.prisma.tenantSubscription.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
    return subscription;
  }

  async getOnboardingSteps(tenantId: string) {
    return this.prisma.onboardingStep.findMany({
      where: { tenantId },
      orderBy: { stepOrder: 'asc' },
    });
  }

  async completeOnboardingStep(tenantId: string, stepKey: string) {
    return this.prisma.onboardingStep.updateMany({
      where: { tenantId, stepKey },
      data: { isCompleted: true, completedAt: new Date() },
    });
  }
}
