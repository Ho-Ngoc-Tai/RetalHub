/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';
import type { Request } from 'express';
import { PostsService, PostEntity } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

const UPLOAD_DIR = join(process.cwd(), 'uploads');

if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

type MulterDestinationCallback = (error: Error | null, destination: string) => void;
type MulterFilenameCallback = (error: Error | null, filename: string) => void;
type MulterBooleanCallback = (error: Error | null, acceptFile: boolean) => void;

const isDestinationCallback = (callback: unknown): callback is MulterDestinationCallback =>
  typeof callback === 'function';

const isFilenameCallback = (callback: unknown): callback is MulterFilenameCallback =>
  typeof callback === 'function';

const isBooleanCallback = (callback: unknown): callback is MulterBooleanCallback =>
  typeof callback === 'function';

const getOriginalName = (file: unknown): string => {
  if (!file || typeof file !== 'object') {
    return '';
  }

  const { originalname } = file as Record<string, unknown>;
  return typeof originalname === 'string' ? originalname : '';
};

const storage = diskStorage({
  destination: (
    _req: Request,
    _file: unknown,
    callback: unknown,
  ) => {
    if (isDestinationCallback(callback)) {
      callback(null, UPLOAD_DIR);
    }
  },
  filename: (
    _req: Request,
    file: unknown,
    callback: unknown,
  ) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const originalExt = extname(getOriginalName(file)).toLowerCase();
    const safeExt =
      originalExt && originalExt.length > 0 && originalExt.length <= 6
        ? originalExt
        : '.jpg';
    if (isFilenameCallback(callback)) {
      callback(null, `${uniqueSuffix}${safeExt}`);
    }
  },
});

const imageFileFilter = (
  _req: Request,
  file: unknown,
  callback: unknown,
) => {
  if (!file || typeof file !== 'object') {
    if (isBooleanCallback(callback)) {
      callback(null, false);
    }
    return;
  }

  const { mimetype } = file as Record<string, unknown>;
  if (isBooleanCallback(callback)) {
    callback(null, typeof mimetype === 'string' && mimetype.startsWith('image/'));
  }
};

type UploadedFileMeta = {
  filename: string;
  mimetype: string;
  originalname: string;
  size: number;
};

const toUploadedFileMeta = (file: unknown): UploadedFileMeta => {
  if (!file || typeof file !== 'object') {
    throw new BadRequestException(
      'Không nhận được tệp tải lên hoặc tệp không hợp lệ.',
    );
  }

  const { filename, mimetype, originalname, size } = file as Record<
    string,
    unknown
  >;

  if (
    typeof filename !== 'string' ||
    typeof mimetype !== 'string' ||
    typeof originalname !== 'string' ||
    typeof size !== 'number'
  ) {
    throw new BadRequestException(
      'Không nhận được tệp tải lên hoặc tệp không hợp lệ.',
    );
  }

  return { filename, mimetype, originalname, size };
};

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(@Body() body: CreatePostDto): Promise<PostEntity> {
    return await this.postsService.create(body);
  }

  @Get()
  async findAll(): Promise<PostEntity[]> {
    return await this.postsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostEntity | null> {
    return await this.postsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdatePostDto,
  ): Promise<PostEntity> {
    return await this.postsService.update(id, body);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      fileFilter: imageFileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  uploadImage(@UploadedFile() file: unknown) {
    const uploadedFile = toUploadedFileMeta(file);

    if (!uploadedFile.mimetype.startsWith('image/')) {
      throw new BadRequestException('Chỉ hỗ trợ tải lên tệp hình ảnh.');
    }

    const publicPath = `/uploads/${uploadedFile.filename}`;
    const baseUrl = (
      process.env.UPLOAD_BASE_URL ??
      process.env.APP_URL ??
      ''
    ).replace(/\/$/, '');
    const url = baseUrl ? `${baseUrl}${publicPath}` : publicPath;

    return {
      success: true,
      url,
      path: publicPath,
      originalName: uploadedFile.originalname,
      size: uploadedFile.size,
      mimeType: uploadedFile.mimetype,
    };
  }
}
