import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StreamingContentEntity } from '../entities/streaming-content.entity';
import { StreamingController } from '../controllers/streaming.controller';
import { StreamingService } from '../services/streaming.service';

/**
 * Streaming module - manages all streaming content functionality
 */
@Module({
  imports: [TypeOrmModule.forFeature([StreamingContentEntity])],
  controllers: [StreamingController],
  providers: [StreamingService],
  exports: [StreamingService],
})
export class StreamingModule {}
