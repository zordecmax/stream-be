import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

/**
 * Module layer - Organizes application structure
 * Modules are responsible for:
 * - Grouping related functionality
 * - Declaring controllers and providers
 * - Managing dependencies between features
 * - Exporting services for use in other modules
 */
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export if other modules need to use this service
})
export class UsersModule {}
