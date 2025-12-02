import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiveStreamEntity } from '../entities/live-stream.entity';
import { LiveStreamService } from '../services/live-stream.service';
import { LiveStreamController } from '../controllers/live-stream.controller';
import { AuthModule } from '../auth/auth.module';

/**
 * Module for live streaming functionality
 */
@Module({
  imports: [TypeOrmModule.forFeature([LiveStreamEntity]), AuthModule],
  controllers: [LiveStreamController],
  providers: [LiveStreamService],
  exports: [LiveStreamService],
})
export class LiveStreamModule {}
