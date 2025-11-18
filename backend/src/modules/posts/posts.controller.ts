import { Body, Controller, Get, Post } from '@nestjs/common';
import { PostsService, PostEntity } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

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
}
