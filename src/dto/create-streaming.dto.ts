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

/**
 * DTO for creating streaming content
 */
export class CreateStreamingDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  @MaxLength(500)
  thumbnailUrl?: string;

  @IsUrl()
  @IsNotEmpty()
  @MaxLength(500)
  videoUrl: string;

  @IsInt()
  @IsOptional()
  @Min(1900)
  @Max(2100)
  year?: number;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  genre?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(10)
  rating?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  duration?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  cast?: string[];

  @IsInt()
  @IsOptional()
  @Min(0)
  watchProgress?: number;
}
