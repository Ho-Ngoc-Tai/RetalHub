import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

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
  publishedAt?: Date | null;
  scheduledFor?: Date | null;
}

interface PostDelegate {
  create(args: { data: Record<string, unknown> }): Promise<PostEntity>;
  updateMany(args: {
    where: Record<string, unknown>;
    data: Record<string, unknown>;
  }): Promise<{ count: number }>;
  update(args: {
    where: { id: string };
    data: Record<string, unknown>;
  }): Promise<PostEntity>;
  findMany(args: { orderBy: { publishedAt: 'desc' } }): Promise<PostEntity[]>;
  findUnique(args: { where: { id: string } }): Promise<PostEntity | null>;
}

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePostDto): Promise<PostEntity> {
    const {
      authorId,
      language = 'vi',
      status,
      category = 'General',
      scheduledFor,
      ...rest
    } = data;

    const prisma = this.prisma as unknown as { post: PostDelegate };

    const scheduledDate = scheduledFor ? new Date(scheduledFor) : null;
    const computedStatus = scheduledDate
      ? 'scheduled'
      : (status ?? 'published');
    const publishedAt =
      computedStatus === 'published'
        ? new Date()
        : (scheduledDate ?? new Date());

    return await prisma.post.create({
      data: {
        ...rest,
        language,
        status: computedStatus,
        category,
        publishedAt,
        scheduledFor: scheduledDate,
        ...(authorId ? { authorId } : {}),
      },
    });
  }

  async findAll(): Promise<PostEntity[]> {
    const prisma = this.prisma as unknown as { post: PostDelegate };

    const now = new Date();

    await prisma.post.updateMany({
      where: {
        status: 'scheduled',
        scheduledFor: { lte: now },
      },
      data: {
        status: 'published',
        publishedAt: now,
        scheduledFor: null,
      },
    });

    return await prisma.post.findMany({
      orderBy: { publishedAt: 'desc' },
    });
  }

  async update(id: string, data: UpdatePostDto): Promise<PostEntity> {
    const prisma = this.prisma as unknown as { post: PostDelegate };

    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    const { scheduledFor, status, ...rest } = data;
    const hasPublishedAt = 'publishedAt' in data;
    const hasScheduledFor = 'scheduledFor' in data;

    let incomingPublishedAt: string | null = null;
    if (hasPublishedAt) {
      const value = (data as { publishedAt?: string | null }).publishedAt;
      incomingPublishedAt = value ?? null;
    }

    const updateData: Record<string, unknown> = { ...rest };

    let scheduledDate: Date | null | undefined;
    if (hasScheduledFor) {
      if (scheduledFor === null) {
        scheduledDate = null;
        updateData.scheduledFor = null;
      } else if (typeof scheduledFor === 'string' && scheduledFor.trim()) {
        const parsedScheduled = new Date(scheduledFor);
        if (!Number.isNaN(parsedScheduled.getTime())) {
          scheduledDate = parsedScheduled;
          updateData.scheduledFor = parsedScheduled;
        }
      }
    }

    let finalStatus = status ?? existing.status;
    if (scheduledDate) {
      finalStatus = 'scheduled';
    } else if (
      hasScheduledFor &&
      scheduledFor === null &&
      finalStatus === 'scheduled'
    ) {
      finalStatus = 'published';
    }

    if (finalStatus && finalStatus !== existing.status) {
      updateData.status = finalStatus;
    }

    if (hasPublishedAt) {
      if (incomingPublishedAt === null) {
        updateData.publishedAt = null;
      } else {
        const parsedPublished = new Date(incomingPublishedAt);
        if (!Number.isNaN(parsedPublished.getTime())) {
          updateData.publishedAt = parsedPublished;
        }
      }
    } else if (existing.status !== 'published' && finalStatus === 'published') {
      updateData.publishedAt = new Date();
    }

    return await prisma.post.update({
      where: { id },
      data: updateData,
    });
  }

  async findOne(id: string): Promise<PostEntity | null> {
    const prisma = this.prisma as unknown as { post: PostDelegate };

    return await prisma.post.findUnique({
      where: { id },
    });
  }
}
