import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, params?: { skip?: number; take?: number; search?: string }) {
    const { skip = 0, take = 50, search } = params || {};
    
    const where: any = { tenantId };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    return this.prisma.contact.findMany({
      where,
      skip,
      take,
      include: { company: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(tenantId: string, id: string) {
    return this.prisma.contact.findFirst({
      where: { id, tenantId },
      include: { 
        company: true,
        conversations: { take: 10, orderBy: { createdAt: 'desc' } },
        deals: { take: 5, orderBy: { createdAt: 'desc' } },
      },
    });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.contact.create({
      data: { ...data, tenantId },
      include: { company: true },
    });
  }

  async update(tenantId: string, id: string, data: any) {
    return this.prisma.contact.update({
      where: { id },
      data,
      include: { company: true },
    });
  }

  async delete(tenantId: string, id: string) {
    return this.prisma.contact.delete({ where: { id } });
  }

  async findByPhone(tenantId: string, phone: string) {
    return this.prisma.contact.findFirst({
      where: { tenantId, phone },
    });
  }

  async findByEmail(tenantId: string, email: string) {
    return this.prisma.contact.findFirst({
      where: { tenantId, email },
    });
  }
}
