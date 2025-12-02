import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, MoreThanOrEqual } from 'typeorm';
import { StreamingContentEntity } from '../entities/streaming-content.entity';
import { CreateStreamingDto, UpdateStreamingDto } from '../dto';

/**
 * Service for streaming content business logic
 */
@Injectable()
export class StreamingService {
  constructor(
    @InjectRepository(StreamingContentEntity)
    private readonly streamingRepository: Repository<StreamingContentEntity>,
  ) {}

  /**
   * Create new streaming content
   */
  async create(
    createStreamingDto: CreateStreamingDto,
  ): Promise<StreamingContentEntity> {
    const content = this.streamingRepository.create(createStreamingDto);
    return await this.streamingRepository.save(content);
  }

  /**
   * Find all streaming content with optional filters
   */
  async findAll(filters?: {
    genre?: string;
    year?: number;
    minRating?: number;
  }): Promise<StreamingContentEntity[]> {
    const where: Record<string, any> = {};

    if (filters?.genre) {
      where.genre = filters.genre;
    }

    if (filters?.year) {
      where.year = filters.year;
    }

    if (filters?.minRating) {
      where.rating = MoreThanOrEqual(filters.minRating);
    }

    return await this.streamingRepository.find({
      where: Object.keys(where).length > 0 ? where : undefined,
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find one streaming content by ID
   */
  async findOne(id: string): Promise<StreamingContentEntity> {
    const content = await this.streamingRepository.findOne({
      where: { id },
    });

    if (!content) {
      throw new NotFoundException(`Streaming content with ID ${id} not found`);
    }

    return content;
  }

  /**
   * Update streaming content
   */
  async update(
    id: string,
    updateStreamingDto: UpdateStreamingDto,
  ): Promise<StreamingContentEntity> {
    const content = await this.findOne(id);

    Object.assign(content, updateStreamingDto);

    return await this.streamingRepository.save(content);
  }

  /**
   * Update watch progress
   */
  async updateWatchProgress(
    id: string,
    progress: number,
  ): Promise<StreamingContentEntity> {
    const content = await this.findOne(id);
    content.watchProgress = progress;
    return await this.streamingRepository.save(content);
  }

  /**
   * Remove streaming content
   */
  async remove(id: string): Promise<void> {
    const content = await this.findOne(id);
    await this.streamingRepository.remove(content);
  }

  /**
   * Search streaming content by title
   */
  async search(query: string): Promise<StreamingContentEntity[]> {
    console.log('Search query:', query);
    return await this.streamingRepository.find({
      where: [
        { title: Like(`%${query}%`) },
        { description: Like(`%${query}%`) },
      ],
      order: { rating: 'DESC' },
    });
  }

  /**
   * Find content by genre
   */
  async findByGenre(genre: string): Promise<StreamingContentEntity[]> {
    return await this.streamingRepository.find({
      where: { genre },
      order: { rating: 'DESC' },
    });
  }

  /**
   * Get top rated content
   */
  async getTopRated(limit: number = 10): Promise<StreamingContentEntity[]> {
    return await this.streamingRepository.find({
      order: { rating: 'DESC' },
      take: limit,
    });
  }

  /**
   * Get content by year
   */
  async findByYear(year: number): Promise<StreamingContentEntity[]> {
    return await this.streamingRepository.find({
      where: { year },
      order: { rating: 'DESC' },
    });
  }

  /**
   * Get recently added content
   */
  async getRecentlyAdded(
    limit: number = 10,
  ): Promise<StreamingContentEntity[]> {
    return await this.streamingRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
