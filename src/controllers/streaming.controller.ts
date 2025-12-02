import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { StreamingService } from '../services/streaming.service';
import {
  CreateStreamingDto,
  UpdateStreamingDto,
  StreamingResponseDto,
} from '../dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

/**
 * Controller for streaming content endpoints
 * Handles all HTTP requests related to streaming content
 */
@ApiTags('streaming')
@Controller('streaming')
export class StreamingController {
  constructor(private readonly streamingService: StreamingService) {}

  /**
   * POST /streaming
   * Create new streaming content
   * Requires JWT authentication
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new streaming content' })
  @ApiBody({ type: CreateStreamingDto })
  @ApiResponse({
    status: 201,
    description: 'Content successfully created',
    type: StreamingResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  async create(
    @Body() createStreamingDto: CreateStreamingDto,
  ): Promise<StreamingResponseDto> {
    const content = await this.streamingService.create(createStreamingDto);
    return new StreamingResponseDto(content);
  }

  /**
   * GET /streaming
   * Get all streaming content with optional filters
   */
  @Get()
  async findAll(
    @Query('genre') genre?: string,
    @Query('year') year?: number,
    @Query('minRating') minRating?: number,
  ): Promise<StreamingResponseDto[]> {
    const contents = await this.streamingService.findAll({
      genre,
      year,
      minRating,
    });
    return contents.map((content) => new StreamingResponseDto(content));
  }

  /**
   * GET /streaming/:id
   * Get streaming content by ID
   */
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<StreamingResponseDto> {
    const content = await this.streamingService.findOne(id);
    return new StreamingResponseDto(content);
  }

  /**
   * PUT /streaming/:id
   * Update streaming content
   * Requires JWT authentication
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStreamingDto: UpdateStreamingDto,
  ): Promise<StreamingResponseDto> {
    const content = await this.streamingService.update(id, updateStreamingDto);
    return new StreamingResponseDto(content);
  }

  /**
   * PUT /streaming/:id/progress
   * Update watch progress for specific content
   * Requires JWT authentication
   */
  @Put(':id/progress')
  @UseGuards(JwtAuthGuard)
  async updateProgress(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('progress') progress: number,
  ): Promise<StreamingResponseDto> {
    const content = await this.streamingService.updateWatchProgress(
      id,
      progress,
    );
    return new StreamingResponseDto(content);
  }

  /**
   * DELETE /streaming/:id
   * Delete streaming content
   * Requires JWT authentication
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.streamingService.remove(id);
  }

  /**
   * GET /streaming/search
   * Search streaming content by title
   */
  @Get('search/query')
  async search(@Query('q') query: string): Promise<StreamingResponseDto[]> {
    const contents = await this.streamingService.search(query);
    return contents.map((content) => new StreamingResponseDto(content));
  }

  /**
   * GET /streaming/genre/:genre
   * Get all content by genre
   */
  @Get('genre/:genre')
  async findByGenre(
    @Param('genre') genre: string,
  ): Promise<StreamingResponseDto[]> {
    const contents = await this.streamingService.findByGenre(genre);
    return contents.map((content) => new StreamingResponseDto(content));
  }

  /**
   * GET /streaming/top-rated
   * Get top rated content
   */
  @Get('top-rated/list')
  async getTopRated(
    @Query('limit') limit: number = 10,
  ): Promise<StreamingResponseDto[]> {
    const contents = await this.streamingService.getTopRated(limit);
    return contents.map((content) => new StreamingResponseDto(content));
  }
}
