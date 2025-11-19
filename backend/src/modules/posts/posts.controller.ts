import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PostsService, PostEntity } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

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
}
