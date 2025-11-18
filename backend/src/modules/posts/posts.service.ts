import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

export interface PostEntity {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  views: number;
  status: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
  authorId?: string | null;
}

interface PostDelegate {
  create(args: { data: Record<string, unknown> }): Promise<PostEntity>;
  findMany(args: { orderBy: { createdAt: 'desc' } }): Promise<PostEntity[]>;
}

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePostDto): Promise<PostEntity> {
    const {
      authorId,
      language = 'vi',
      status = 'draft',
      category = 'General',
      ...rest
    } = data;

    const prisma = this.prisma as unknown as { post: PostDelegate };

    return await prisma.post.create({
      data: {
        ...rest,
        language,
        status,
        category,
        ...(authorId ? { authorId } : {}),
      },
    });
  }

  async findAll(): Promise<PostEntity[]> {
    const prisma = this.prisma as unknown as { post: PostDelegate };

    return await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
