import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';

/**
 * DTO for creating a live stream
 */
export class CreateLiveStreamDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}
