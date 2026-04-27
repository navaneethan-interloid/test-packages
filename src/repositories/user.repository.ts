import { Injectable } from '@nestjs/common';
import type { 
  CursorFindManyParams, 
  CursorPaginated, 
  FindManyParams, 
  IBaseRepository, 
  Paginated 
} from '@interloid/core';
import { User as PrismaUser } from '@prisma/client'; 
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersRepository implements IBaseRepository<PrismaUser> {
  constructor(private readonly prisma: PrismaService) {}
    findMany(params?: FindManyParams<PrismaUser> | undefined): Promise<Paginated<PrismaUser>> {
        throw new Error('Method not implemented.');
    }
    findManyCursor(params?: CursorFindManyParams<PrismaUser> | undefined): Promise<CursorPaginated<PrismaUser>> {
        throw new Error('Method not implemented.');
    }

  async findById(id: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findOne(filter: Partial<PrismaUser>): Promise<PrismaUser | null> {
    return this.prisma.user.findFirst({ where: filter as any });
  }

  async create(data: Omit<PrismaUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<PrismaUser> {
    return this.prisma.user.create({ data: data as any });
  }

  async update(id: string, data: Partial<PrismaUser>): Promise<PrismaUser> {
    return this.prisma.user.update({
      where: { id },
      data: data as any,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async count(filter?: Partial<PrismaUser>): Promise<number> {
    return this.prisma.user.count({ where: filter as any });
  }

  async exists(filter: Partial<PrismaUser>): Promise<boolean> {
    const count = await this.prisma.user.count({ where: filter as any });
    return count > 0;
  }
}