import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { StreamingContentEntity } from '../entities/streaming-content.entity';
import { UserEntity } from '../entities/user.entity';
import { LiveStreamEntity } from '../entities/live-stream.entity';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'streaming_db',
    entities: [StreamingContentEntity, UserEntity, LiveStreamEntity],
    synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true' || false,
    logging: process.env.TYPEORM_LOGGING === 'true' || false,
    migrations: ['dist/migrations/**/*.js'],
    migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN === 'true' || false,
    ssl:
      process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
    extra: {
      max: parseInt(process.env.DB_POOL_MAX || '10', 10),
      min: parseInt(process.env.DB_POOL_MIN || '2', 10),
    },
  }),
);
