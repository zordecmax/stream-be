import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsUrl,
  IsArray,
  Min,
  Max,
  MaxLength,
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for creating streaming content
 */
export class CreateStreamingDto {
  @ApiProperty({
    description: 'Content title',
    example: 'Breaking Bad',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    description: 'Content description',
    example: 'A high school chemistry teacher turned methamphetamine producer',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Thumbnail image URL',
    example: 'https://example.com/thumbnails/breaking-bad.jpg',
    maxLength: 500,
  })
  @IsUrl()
  @IsOptional()
  @MaxLength(500)
  thumbnailUrl?: string;

  @ApiProperty({
    description: 'Video file URL',
    example: 'https://example.com/videos/breaking-bad-s1e1.mp4',
    maxLength: 500,
  })
  @IsUrl()
  @IsNotEmpty()
  @MaxLength(500)
  videoUrl: string;

  @ApiPropertyOptional({
    description: 'Release year',
    example: 2008,
    minimum: 1900,
    maximum: 2100,
  })
  @IsInt()
  @IsOptional()
  @Min(1900)
  @Max(2100)
  year?: number;

  @ApiPropertyOptional({
    description: 'Content genre',
    example: 'Drama',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  genre?: string;

  @ApiPropertyOptional({
    description: 'Content rating (0-10)',
    example: 9.5,
    minimum: 0,
    maximum: 10,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(10)
  rating?: number;

  @ApiPropertyOptional({
    description: 'Duration in minutes',
    example: 47,
    minimum: 0,
  })
  @IsInt()
  @IsOptional()
  @Min(0)
  duration?: number;

  @ApiPropertyOptional({
    description: 'Cast members',
    example: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  cast?: string[];

  @ApiPropertyOptional({
    description: 'Watch progress in seconds',
    example: 0,
    minimum: 0,
  })
  @IsInt()
  @IsOptional()
  @Min(0)
  watchProgress?: number;
}
