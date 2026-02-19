import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiAgentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.aiAgent.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } });
  }

  async findById(tenantId: string, id: string) {
    return this.prisma.aiAgent.findFirst({ where: { id, tenantId } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.aiAgent.create({ data: { ...data, tenantId } });
  }

  async update(tenantId: string, id: string, data: any) {
    return this.prisma.aiAgent.update({ where: { id }, data });
  }

  async delete(tenantId: string, id: string) {
    return this.prisma.aiAgent.delete({ where: { id } });
  }

  async getWhatsappConfig(agentId: string) {
    return this.prisma.agentWhatsappConfig.findUnique({ where: { agentId } });
  }

  async updateWhatsappConfig(tenantId: string, agentId: string, data: any) {
    return this.prisma.agentWhatsappConfig.upsert({
      where: { agentId },
      create: { ...data, agentId, tenantId },
      update: data,
    });
  }
}
