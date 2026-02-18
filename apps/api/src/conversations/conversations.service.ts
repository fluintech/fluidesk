import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, params?: { status?: string; teamId?: string; assignedUserId?: string; take?: number }) {
    const where: any = { tenantId };
    if (params?.status) where.status = params.status;
    if (params?.teamId) where.teamId = params.teamId;
    if (params?.assignedUserId) where.assignedUserId = params.assignedUserId;

    return this.prisma.conversation.findMany({
      where,
      take: params?.take || 50,
      include: {
        contact: true,
        channel: true,
        team: true,
        assignedUser: { select: { id: true, name: true, avatarUrl: true } },
        tags: { include: { tag: true } },
        _count: { select: { messages: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findById(tenantId: string, id: string) {
    return this.prisma.conversation.findFirst({
      where: { id, tenantId },
      include: {
        contact: true,
        channel: true,
        team: true,
        assignedUser: { select: { id: true, name: true, avatarUrl: true } },
        tags: { include: { tag: true } },
        messages: { orderBy: { createdAt: 'asc' }, take: 100 },
      },
    });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.conversation.create({
      data: { ...data, tenantId },
      include: { contact: true, channel: true },
    });
  }

  async update(tenantId: string, id: string, data: any) {
    return this.prisma.conversation.update({
      where: { id },
      data,
      include: { contact: true, assignedUser: true },
    });
  }

  async addMessage(conversationId: string, data: any) {
    const message = await this.prisma.message.create({
      data: { ...data, conversationId },
    });

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  async assign(tenantId: string, id: string, userId: string) {
    return this.prisma.conversation.update({
      where: { id },
      data: { assignedUserId: userId },
    });
  }

  async close(tenantId: string, id: string) {
    return this.prisma.conversation.update({
      where: { id },
      data: { status: 'closed', closedAt: new Date() },
    });
  }

  async addTag(tenantId: string, conversationId: string, tagId: string) {
    return this.prisma.conversationTag.create({
      data: { conversationId, tagId },
    });
  }

  async removeTag(conversationId: string, tagId: string) {
    return this.prisma.conversationTag.delete({
      where: { conversationId_tagId: { conversationId, tagId } },
    });
  }

  async getStats(tenantId: string) {
    const [total, open, closed, pending] = await Promise.all([
      this.prisma.conversation.count({ where: { tenantId } }),
      this.prisma.conversation.count({ where: { tenantId, status: 'open' } }),
      this.prisma.conversation.count({ where: { tenantId, status: 'closed' } }),
      this.prisma.conversation.count({ where: { tenantId, status: 'pending' } }),
    ]);

    return { total, open, closed, pending };
  }
}
