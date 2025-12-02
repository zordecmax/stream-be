/**
 * DTO for streaming content response
 * Represents the data structure returned by the API
 */
export class StreamingResponseDto {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  videoUrl: string;
  year?: number;
  genre?: string;
  rating?: number;
  duration?: number;
  cast?: string[];
  watchProgress: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<StreamingResponseDto>) {
    Object.assign(this, partial);
  }
}
