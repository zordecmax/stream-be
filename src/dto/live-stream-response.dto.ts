/**
 * Response DTO for live stream
 */
export class LiveStreamResponseDto {
  id!: string;
  muxStreamId!: string;
  streamKey!: string;
  playbackId!: string;
  title!: string;
  description?: string;
  status!: string;
  isActive!: boolean;
  assetId?: string;
  user!: {
    id: string;
    email: string;
    name?: string;
  };
  streamUrl!: string; // RTMP URL for OBS/streaming software
  playbackUrl!: string; // HLS URL for playback
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<LiveStreamResponseDto>) {
    Object.assign(this, partial);
  }
}

/**
 * Public response DTO (without stream key)
 */
export class PublicLiveStreamResponseDto {
  id!: string;
  playbackId!: string;
  title!: string;
  description?: string;
  status!: string;
  user!: {
    id: string;
    name?: string;
  };
  playbackUrl!: string;
  createdAt!: Date;

  constructor(partial: Partial<PublicLiveStreamResponseDto>) {
    Object.assign(this, partial);
  }
}
