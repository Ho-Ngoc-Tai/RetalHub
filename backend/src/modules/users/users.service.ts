import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

type CreateUserData = {
  email: string;
  password: string;
  name?: string | null;
  role?: string | null;
  refreshToken?: string | null;
};

type UpdateUserData = {
  name?: string | null;
  role?: string | null;
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: CreateUserData) {
    return this.prisma.user.create({ data });
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken } as { refreshToken?: string | null },
    });
  }

  async update(id: string, data: UpdateUserData) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
