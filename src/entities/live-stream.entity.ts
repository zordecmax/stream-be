import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

/**
 * LiveStream entity for storing Mux live stream data
 */
@Entity('live_streams')
export class LiveStreamEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Mux live stream ID
  @Column({ name: 'mux_stream_id', unique: true, length: 255 })
  muxStreamId!: string;

  // Mux stream key (secret)
  @Column({ name: 'stream_key', length: 500 })
  streamKey!: string;

  // Mux playback ID
  @Column({ name: 'playback_id', length: 255 })
  playbackId!: string;

  // Stream title
  @Column({ length: 255 })
  title!: string;

  // Stream description
  @Column({ type: 'text', nullable: true })
  description?: string;

  // Stream status: idle, active, disconnected
  @Column({ length: 50, default: 'idle' })
  status!: string;

  // User who created the stream
  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  // Is stream active
  @Column({ name: 'is_active', default: true })
  isActive!: boolean;

  // Asset ID (for recorded stream)
  @Column({ name: 'asset_id', nullable: true, length: 255 })
  assetId?: string;

  // Mux created timestamp
  @Column({ name: 'mux_created_at', nullable: true })
  muxCreatedAt?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
