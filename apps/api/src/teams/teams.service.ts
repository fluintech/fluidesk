import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.team.findMany({
      where: { tenantId },
      include: {
        members: { include: { user: true } },
        _count: { select: { conversations: true } },
      },
    });
  }

  async findById(tenantId: string, id: string) {
    return this.prisma.team.findFirst({
      where: { id, tenantId },
      include: { members: { include: { user: true } } },
    });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.team.create({
      data: { ...data, tenantId },
    });
  }

  async update(tenantId: string, id: string, data: any) {
    return this.prisma.team.update({
      where: { id },
      data,
    });
  }

  async delete(tenantId: string, id: string) {
    return this.prisma.team.delete({ where: { id } });
  }

  async addMember(tenantId: string, teamId: string, userId: string, role = 'member') {
    return this.prisma.teamMember.create({
      data: { teamId, userId, roleInTeam: role },
    });
  }

  async removeMember(teamId: string, userId: string) {
    return this.prisma.teamMember.delete({
      where: { teamId_userId: { teamId, userId } },
    });
  }
}
