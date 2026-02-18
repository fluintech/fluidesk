import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiAgentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.aiAgent.findMany({
      where: { tenantId },
      include: {
        whatsappConfig: true,
        personality: true,
        _count: { select: { teams: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(tenantId: string, id: string) {
    return this.prisma.aiAgent.findFirst({
      where: { id, tenantId },
      include: {
        whatsappConfig: true,
        personality: true,
        conversationTags: true,
        classificationCategories: true,
        inactivityFollowups: true,
        teams: true,
      },
    });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.aiAgent.create({
      data: { ...data, tenantId },
      include: { whatsappConfig: true, personality: true },
    });
  }

  async update(tenantId: string, id: string, data: any) {
    return this.prisma.aiAgent.update({
      where: { id },
      data,
      include: { whatsappConfig: true, personality: true },
    });
  }

  async delete(tenantId: string, id: string) {
    return this.prisma.aiAgent.delete({ where: { id } });
  }

  // WhatsApp Config
  async getWhatsappConfig(tenantId: string, agentId: string) {
    return this.prisma.agentWhatsappConfig.findUnique({
      where: { agentId },
    });
  }

  async updateWhatsappConfig(tenantId: string, agentId: string, data: any) {
    return this.prisma.agentWhatsappConfig.upsert({
      where: { agentId },
      create: { ...data, agentId, tenantId },
      update: data,
    });
  }

  // Personality
  async getPersonality(tenantId: string, agentId: string) {
    return this.prisma.agentPersonality.findUnique({
      where: { agentId },
    });
  }

  async updatePersonality(tenantId: string, agentId: string, data: any) {
    return this.prisma.agentPersonality.upsert({
      where: { agentId },
      create: { ...data, agentId, tenantId },
      update: data,
    });
  }

  // Tags
  async getTags(tenantId: string, agentId: string) {
    return this.prisma.agentConversationTag.findMany({
      where: { agentId, tenantId },
    });
  }

  async createTag(tenantId: string, agentId: string, data: any) {
    return this.prisma.agentConversationTag.create({
      data: { ...data, agentId, tenantId },
    });
  }

  async deleteTag(tenantId: string, agentId: string, tagId: string) {
    return this.prisma.agentConversationTag.delete({
      where: { id: tagId },
    });
  }

  // Classification Categories
  async getClassificationCategories(tenantId: string, agentId: string) {
    return this.prisma.agentClassificationCategory.findMany({
      where: { agentId, tenantId },
    });
  }

  async createClassificationCategory(tenantId: string, agentId: string, data: any) {
    return this.prisma.agentClassificationCategory.create({
      data: { ...data, agentId, tenantId },
    });
  }

  // Inactivity Followups
  async getInactivityFollowups(tenantId: string, agentId: string) {
    return this.prisma.agentInactivityFollowup.findMany({
      where: { agentId, tenantId },
      orderBy: { followupOrder: 'asc' },
    });
  }

  async createInactivityFollowup(tenantId: string, agentId: string, data: any) {
    return this.prisma.agentInactivityFollowup.create({
      data: { ...data, agentId, tenantId },
    });
  }

  async updateInactivityFollowup(tenantId: string, agentId: string, id: string, data: any) {
    return this.prisma.agentInactivityFollowup.update({
      where: { id },
      data,
    });
  }

  async deleteInactivityFollowup(id: string) {
    return this.prisma.agentInactivityFollowup.delete({ where: { id } });
  }

  // Metrics
  async getMetrics(tenantId: string, agentId: string, startDate?: Date, endDate?: Date) {
    const where: any = { agentId, tenantId };
    if (startDate && endDate) {
      where.metricDate = { gte: startDate, lte: endDate };
    }

    return this.prisma.agentMetric.findMany({
      where,
      orderBy: { metricDate: 'desc' },
      take: 30,
    });
  }

  // Generate WhatsApp QR Code
  async generateQrCode(tenantId: string, agentId: string) {
    const config = await this.prisma.agentWhatsappConfig.findUnique({ where: { agentId } });
    if (!config) throw new Error('WhatsApp config not found');

    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(code)}`;

    const qr = await this.prisma.whatsappQrCode.create({
      data: {
        configId: config.id,
        qrCode,
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        status: 'pending',
      },
    });

    await this.prisma.agentWhatsappConfig.update({
      where: { agentId },
      data: { connectionStatus: 'qr_pending' },
    });

    return qr;
  }
}
