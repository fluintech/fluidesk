import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DealsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, params?: { pipelineId?: string; stageId?: string }) {
    const where: any = { tenantId };
    if (params?.pipelineId) where.pipelineId = params.pipelineId;
    if (params?.stageId) where.stageId = params.stageId;

    return this.prisma.deal.findMany({
      where,
      include: {
        contact: true,
        company: true,
        stage: true,
        assignedTo: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(tenantId: string, id: string) {
    return this.prisma.deal.findFirst({
      where: { id, tenantId },
      include: {
        contact: true,
        company: true,
        stage: true,
        pipeline: true,
        assignedTo: true,
        appointments: true,
      },
    });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.deal.create({
      data: { ...data, tenantId },
      include: { contact: true, stage: true },
    });
  }

  async update(tenantId: string, id: string, data: any) {
    return this.prisma.deal.update({
      where: { id },
      data,
      include: { contact: true, stage: true },
    });
  }

  async moveStage(tenantId: string, id: string, stageId: string) {
    const stage = await this.prisma.pipelineStage.findUnique({ where: { id: stageId } });
    
    const updateData: any = { stageId };
    if (stage?.isWon) {
      updateData.wonAt = new Date();
      updateData.status = 'won';
    } else if (stage?.isLost) {
      updateData.lostAt = new Date();
      updateData.status = 'lost';
    }

    return this.prisma.deal.update({
      where: { id },
      data: updateData,
      include: { stage: true },
    });
  }

  async delete(tenantId: string, id: string) {
    return this.prisma.deal.delete({ where: { id } });
  }

  async getStats(tenantId: string) {
    const deals = await this.prisma.deal.findMany({
      where: { tenantId },
      select: { value: true, stage: { select: { isWon: true, isLost: true } } },
    });

    const total = deals.reduce((acc, d) => acc + Number(d.value), 0);
    const won = deals.filter(d => d.stage?.isWon).reduce((acc, d) => acc + Number(d.value), 0);
    const lost = deals.filter(d => d.stage?.isLost).reduce((acc, d) => acc + Number(d.value), 0);

    return { total, won, lost, count: deals.length };
  }
}
