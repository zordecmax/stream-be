import { Test, TestingModule } from '@nestjs/testing';
import { StreamingController } from './streaming.controller';
import { StreamingService } from '../services/streaming.service';
import { CreateStreamingDto, UpdateStreamingDto } from '../dto';
import { NotFoundException } from '@nestjs/common';

describe('StreamingController', () => {
  let controller: StreamingController;
  let service: StreamingService;

  const mockStreamingService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    updateWatchProgress: jest.fn(),
    remove: jest.fn(),
    search: jest.fn(),
    findByGenre: jest.fn(),
    getTopRated: jest.fn(),
  };

  const mockContent = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Test Movie',
    description: 'Test description',
    videoUrl: 'https://example.com/video.mp4',
    thumbnailUrl: 'https://example.com/thumb.jpg',
    year: 2024,
    genre: 'Action',
    rating: 8.5,
    duration: 120,
    cast: ['Actor 1', 'Actor 2'],
    watchProgress: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StreamingController],
      providers: [
        {
          provide: StreamingService,
          useValue: mockStreamingService,
        },
      ],
    }).compile();

    controller = module.get<StreamingController>(StreamingController);
    service = module.get<StreamingService>(StreamingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create streaming content', async () => {
      const createDto: CreateStreamingDto = {
        title: 'Test Movie',
        videoUrl: 'https://example.com/video.mp4',
        year: 2024,
        genre: 'Action',
        rating: 8.5,
      };

      mockStreamingService.create.mockResolvedValue(mockContent);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result.title).toBe(mockContent.title);
    });
  });

  describe('findAll', () => {
    it('should return all streaming content', async () => {
      mockStreamingService.findAll.mockResolvedValue([mockContent]);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe(mockContent.title);
    });

    it('should return filtered content by genre', async () => {
      mockStreamingService.findAll.mockResolvedValue([mockContent]);

      const result = await controller.findAll('Action');

      expect(service.findAll).toHaveBeenCalledWith({
        genre: 'Action',
        year: undefined,
        minRating: undefined,
      });
      expect(result).toHaveLength(1);
    });

    it('should return filtered content by year and rating', async () => {
      mockStreamingService.findAll.mockResolvedValue([mockContent]);

      const result = await controller.findAll(undefined, 2024, 8.0);

      expect(service.findAll).toHaveBeenCalledWith({
        genre: undefined,
        year: 2024,
        minRating: 8.0,
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return streaming content by id', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      mockStreamingService.findOne.mockResolvedValue(mockContent);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result.id).toBe(mockContent.id);
    });

    it('should throw NotFoundException when content not found', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      mockStreamingService.findOne.mockRejectedValue(
        new NotFoundException(`Streaming content with ID ${id} not found`),
      );

      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update streaming content', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const updateDto: UpdateStreamingDto = {
        rating: 9.0,
      };

      const updatedContent = { ...mockContent, rating: 9.0 };
      mockStreamingService.update.mockResolvedValue(updatedContent);

      const result = await controller.update(id, updateDto);

      expect(service.update).toHaveBeenCalledWith(id, updateDto);
      expect(result.rating).toBe(9.0);
    });
  });

  describe('updateProgress', () => {
    it('should update watch progress', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const progress = 50;

      const updatedContent = { ...mockContent, watchProgress: 50 };
      mockStreamingService.updateWatchProgress.mockResolvedValue(
        updatedContent,
      );

      const result = await controller.updateProgress(id, progress);

      expect(service.updateWatchProgress).toHaveBeenCalledWith(id, progress);
      expect(result.watchProgress).toBe(50);
    });
  });

  describe('remove', () => {
    it('should delete streaming content', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      mockStreamingService.remove.mockResolvedValue(undefined);

      await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });

  describe('search', () => {
    it('should search streaming content', async () => {
      const query = 'test';
      mockStreamingService.search.mockResolvedValue([mockContent]);

      const result = await controller.search(query);

      expect(service.search).toHaveBeenCalledWith(query);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe(mockContent.title);
    });
  });

  describe('findByGenre', () => {
    it('should return content by genre', async () => {
      const genre = 'Action';
      mockStreamingService.findByGenre.mockResolvedValue([mockContent]);

      const result = await controller.findByGenre(genre);

      expect(service.findByGenre).toHaveBeenCalledWith(genre);
      expect(result).toHaveLength(1);
    });
  });

  describe('getTopRated', () => {
    it('should return top rated content with default limit', async () => {
      mockStreamingService.getTopRated.mockResolvedValue([mockContent]);

      const result = await controller.getTopRated();

      expect(service.getTopRated).toHaveBeenCalledWith(10);
      expect(result).toHaveLength(1);
    });

    it('should return top rated content with custom limit', async () => {
      mockStreamingService.getTopRated.mockResolvedValue([mockContent]);

      const result = await controller.getTopRated(20);

      expect(service.getTopRated).toHaveBeenCalledWith(20);
      expect(result).toHaveLength(1);
    });
  });
});
