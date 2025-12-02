import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { LiveStreamService } from '../services/live-stream.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateLiveStreamDto } from '../dto/create-live-stream.dto';
import {
  LiveStreamResponseDto,
  PublicLiveStreamResponseDto,
} from '../dto/live-stream-response.dto';

/**
 * Controller for live streaming endpoints
 */
@ApiTags('live-streams')
@Controller('live-streams')
export class LiveStreamController {
  constructor(private readonly liveStreamService: LiveStreamService) {}

  /**
   * POST /live-streams
   * Create a new live stream (requires authentication)
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new live stream' })
  @ApiBody({ type: CreateLiveStreamDto })
  @ApiResponse({
    status: 201,
    description: 'Live stream successfully created with Mux',
    type: LiveStreamResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  async createLiveStream(
    @Body() createLiveStreamDto: CreateLiveStreamDto,
    @Request() req: any,
  ): Promise<LiveStreamResponseDto> {
    const stream = await this.liveStreamService.createLiveStream(
      createLiveStreamDto,
      req.user,
    );

    return new LiveStreamResponseDto({
      id: stream.id,
      muxStreamId: stream.muxStreamId,
      streamKey: stream.streamKey,
      playbackId: stream.playbackId,
      title: stream.title,
      description: stream.description,
      status: stream.status,
      isActive: stream.isActive,
      assetId: stream.assetId,
      user: {
        id: stream.user.id,
        email: stream.user.email,
        name: stream.user.name,
      },
      streamUrl: this.liveStreamService.getRtmpUrl(stream.streamKey),
      playbackUrl: this.liveStreamService.getPlaybackUrl(stream.playbackId),
      createdAt: stream.createdAt,
      updatedAt: stream.updatedAt,
    });
  }

  /**
   * GET /live-streams/my
   * Get all live streams for authenticated user
   */
  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyLiveStreams(
    @Request() req: any,
  ): Promise<LiveStreamResponseDto[]> {
    const streams = await this.liveStreamService.getUserLiveStreams(
      req.user.userId,
    );

    return streams.map(
      (stream) =>
        new LiveStreamResponseDto({
          id: stream.id,
          muxStreamId: stream.muxStreamId,
          streamKey: stream.streamKey,
          playbackId: stream.playbackId,
          title: stream.title,
          description: stream.description,
          status: stream.status,
          isActive: stream.isActive,
          assetId: stream.assetId,
          user: {
            id: stream.user.id,
            email: stream.user.email,
            name: stream.user.name,
          },
          streamUrl: this.liveStreamService.getRtmpUrl(stream.streamKey),
          playbackUrl: this.liveStreamService.getPlaybackUrl(stream.playbackId),
          createdAt: stream.createdAt,
          updatedAt: stream.updatedAt,
        }),
    );
  }

  /**
   * GET /live-streams/active
   * Get all active live streams (public)
   */
  @Get('active')
  async getActiveLiveStreams(): Promise<PublicLiveStreamResponseDto[]> {
    const streams = await this.liveStreamService.getActiveLiveStreams();

    return streams.map(
      (stream) =>
        new PublicLiveStreamResponseDto({
          id: stream.id,
          playbackId: stream.playbackId,
          title: stream.title,
          description: stream.description,
          status: stream.status,
          user: {
            id: stream.user.id,
            name: stream.user.name,
          },
          playbackUrl: this.liveStreamService.getPlaybackUrl(stream.playbackId),
          createdAt: stream.createdAt,
        }),
    );
  }

  /**
   * GET /live-streams/:id
   * Get live stream by ID (public)
   */
  @Get(':id')
  async getLiveStreamById(
    @Param('id') id: string,
  ): Promise<PublicLiveStreamResponseDto> {
    const stream = await this.liveStreamService.getLiveStreamById(id);

    return new PublicLiveStreamResponseDto({
      id: stream.id,
      playbackId: stream.playbackId,
      title: stream.title,
      description: stream.description,
      status: stream.status,
      user: {
        id: stream.user.id,
        name: stream.user.name,
      },
      playbackUrl: this.liveStreamService.getPlaybackUrl(stream.playbackId),
      createdAt: stream.createdAt,
    });
  }

  /**
   * DELETE /live-streams/:id
   * Delete live stream (requires authentication and ownership)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteLiveStream(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<void> {
    await this.liveStreamService.deleteLiveStream(id, req.user.userId);
  }

  /**
   * PUT /live-streams/:id/deactivate
   * Deactivate live stream (requires authentication and ownership)
   */
  @Put(':id/deactivate')
  @UseGuards(JwtAuthGuard)
  async deactivateLiveStream(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<LiveStreamResponseDto> {
    const stream = await this.liveStreamService.deactivateStream(
      id,
      req.user.userId,
    );

    return new LiveStreamResponseDto({
      id: stream.id,
      muxStreamId: stream.muxStreamId,
      streamKey: stream.streamKey,
      playbackId: stream.playbackId,
      title: stream.title,
      description: stream.description,
      status: stream.status,
      isActive: stream.isActive,
      assetId: stream.assetId,
      user: {
        id: stream.user.id,
        email: stream.user.email,
        name: stream.user.name,
      },
      streamUrl: this.liveStreamService.getRtmpUrl(stream.streamKey),
      playbackUrl: this.liveStreamService.getPlaybackUrl(stream.playbackId),
      createdAt: stream.createdAt,
      updatedAt: stream.updatedAt,
    });
  }
}
