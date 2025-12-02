import { PartialType } from '@nestjs/mapped-types';
import { CreateStreamingDto } from './create-streaming.dto';
import { IsInt, IsOptional, Min } from 'class-validator';

/**
 * DTO for updating streaming content
 * All fields are optional since partial updates are allowed
 */
export class UpdateStreamingDto extends PartialType(CreateStreamingDto) {
  @IsInt()
  @IsOptional()
  @Min(0)
  watchProgress?: number;
}
