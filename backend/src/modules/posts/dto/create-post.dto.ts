import {
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

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
  @IsIn(['published', 'archived', 'scheduled'])
  readonly status?: 'published' | 'archived' | 'scheduled';

  @IsOptional()
  @IsDateString()
  readonly scheduledFor?: string;

  @IsOptional()
  @IsDateString()
  readonly publishedAt?: string;
}
