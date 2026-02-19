import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async findById(tenantId: string) {
    return this.prisma.tenant.findUnique({ where: { id: tenantId } });
  }

  async update(tenantId: string, data: any) {
    return this.prisma.tenant.update({ where: { id: tenantId }, data });
  }

  async getPipelines(tenantId: string) {
    return this.prisma.pipeline.findMany({ where: { tenantId }, include: { stages: true } });
  }
}
