import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Mux from '@mux/mux-node';
import { LiveStreamEntity } from '../entities/live-stream.entity';
import { UserEntity } from '../entities/user.entity';
import { CreateLiveStreamDto } from '../dto/create-live-stream.dto';

/**
 * Service for managing live streams with Mux
 */
@Injectable()
export class LiveStreamService {
  private readonly logger = new Logger(LiveStreamService.name);
  private readonly mux: Mux;

  constructor(
    @InjectRepository(LiveStreamEntity)
    private readonly liveStreamRepository: Repository<LiveStreamEntity>,
    private readonly configService: ConfigService,
  ) {
    // Initialize Mux client
    const tokenId = this.configService.get<string>('MUX_TOKEN_ID');
    const tokenSecret = this.configService.get<string>('MUX_TOKEN_SECRET');

    if (!tokenId || !tokenSecret) {
      this.logger.warn('Mux credentials not configured');
    }

    this.mux = new Mux({
      tokenId: tokenId || '',
      tokenSecret: tokenSecret || '',
    });
  }

  /**
   * Create a new live stream
   */
  async createLiveStream(
    createLiveStreamDto: CreateLiveStreamDto,
    user: UserEntity,
  ): Promise<LiveStreamEntity> {
    this.logger.log(`Creating live stream for user ${user.email}`);

    // Create Mux live stream
    const muxStream = await this.mux.video.liveStreams.create({
      playback_policy: ['public'],
      new_asset_settings: { playback_policy: ['public'] },
    });

    this.logger.log(`Mux stream created: ${muxStream.id}`);

    // Save to database
    const liveStream = this.liveStreamRepository.create({
      muxStreamId: muxStream.id,
      streamKey: muxStream.stream_key || '',
      playbackId: muxStream.playback_ids?.[0]?.id || '',
      title: createLiveStreamDto.title,
      description: createLiveStreamDto.description,
      status: muxStream.status || 'idle',
      user,
      muxCreatedAt: muxStream.created_at,
    });

    return await this.liveStreamRepository.save(liveStream);
  }

  /**
   * Get all live streams for a user
   */
  async getUserLiveStreams(userId: string): Promise<LiveStreamEntity[]> {
    return await this.liveStreamRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get all active live streams (public)
   */
  async getActiveLiveStreams(): Promise<LiveStreamEntity[]> {
    return await this.liveStreamRepository.find({
      where: { status: 'active', isActive: true },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get live stream by ID
   */
  async getLiveStreamById(id: string): Promise<LiveStreamEntity> {
    const stream = await this.liveStreamRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!stream) {
      throw new NotFoundException(`Live stream with ID ${id} not found`);
    }

    return stream;
  }

  /**
   * Delete live stream
   */
  async deleteLiveStream(id: string, userId: string): Promise<void> {
    const stream = await this.getLiveStreamById(id);

    // Check if user owns the stream with null safety
    if (!stream || !stream.user || stream.user.id !== userId) {
      throw new NotFoundException('Stream not found or access denied');
    }

    // Delete from Mux
    try {
      await this.mux.video.liveStreams.delete(stream.muxStreamId);
      this.logger.log(`Deleted Mux stream: ${stream.muxStreamId}`);
    } catch (error) {
      this.logger.error(`Failed to delete Mux stream: ${error}`);
    }

    // Delete from database
    await this.liveStreamRepository.remove(stream);
  }

  /**
   * Update stream status from Mux webhook
   */
  async updateStreamStatus(
    muxStreamId: string,
    status: string,
  ): Promise<void> {
    await this.liveStreamRepository.update(
      { muxStreamId },
      { status, updatedAt: new Date() },
    );
    this.logger.log(`Updated stream ${muxStreamId} status to ${status}`);
  }

  /**
   * Activate stream
   */
  async activateStream(id: string, userId: string): Promise<LiveStreamEntity> {
    const stream = await this.getLiveStreamById(id);

    // Additional null checks
    if (!stream || !stream.user || stream.user.id !== userId) {
      throw new NotFoundException('Stream not found or access denied');
    }

    stream.isActive = true;
    return await this.liveStreamRepository.save(stream);
  }

  /**
   * Deactivate stream
   */
  async deactivateStream(id: string, userId: string): Promise<LiveStreamEntity> {
    const stream = await this.getLiveStreamById(id);

    // Additional null checks
    if (!stream || !stream.user || stream.user.id !== userId) {
      throw new NotFoundException('Stream not found or access denied');
    }

    stream.isActive = false;
    return await this.liveStreamRepository.save(stream);
  }

  /**
   * Get RTMP URL for streaming
   */
  getRtmpUrl(streamKey: string): string {
    return `rtmps://global-live.mux.com:443/app/${streamKey}`;
  }

  /**
   * Get HLS playback URL
   */
  getPlaybackUrl(playbackId: string): string {
    return `https://stream.mux.com/${playbackId}.m3u8`;
  }
}
