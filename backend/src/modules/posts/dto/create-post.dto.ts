import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(3)
  readonly title!: string;

  @IsString()
  @MinLength(10)
  readonly description!: string;

  @IsString()
  @MinLength(20)
  readonly content!: string;

  @IsOptional()
  @IsString()
  readonly category?: string;

  @IsOptional()
  @IsString()
  readonly authorId?: string;

  @IsOptional()
  @IsString()
  readonly language?: string;

  @IsOptional()
  @IsIn(['draft', 'published', 'archived', 'scheduled'])
  readonly status?: 'draft' | 'published' | 'archived' | 'scheduled';
}
