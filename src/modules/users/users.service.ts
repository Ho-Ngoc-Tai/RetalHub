import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

type CreateUserData = {
  email: string;
  password: string;
  name?: string | null;
  role?: string | null;
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: CreateUserData) {
    return this.prisma.user.create({ data });
  }
}
