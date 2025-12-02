import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('streaming_content')
export class StreamingContentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    name: 'thumbnail_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  thumbnailUrl: string;

  @Column({ name: 'video_url', type: 'varchar', length: 500 })
  videoUrl: string;

  @Column({ type: 'int', nullable: true })
  year: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  genre: string;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  rating: number;

  @Column({ type: 'int', nullable: true })
  duration: number;

  @Column({ type: 'json', nullable: true })
  cast: string[];

  @Column({ name: 'watch_progress', type: 'int', default: 0 })
  watchProgress: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
