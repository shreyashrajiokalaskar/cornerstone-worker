import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './common.entity';
import { DocumentChunkEntity } from './document-chunk.entity';
import { DocumentEntity } from './document.entity';
import { UserEntity } from './user.entity';

@Entity('workspaces')
export class WorkspaceEntity extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => UserEntity, (user) => user.workspaces)
  @JoinColumn({ name: 'ownerId' })
  owner: UserEntity;

  @Column()
  ownerId: string;

  @OneToMany(() => DocumentEntity, (docs) => docs.workspace, {
    cascade: true,
  })
  documents: DocumentEntity[];

  @Column({
    type: 'boolean',
    default: false,
  })
  active: boolean;

  @OneToMany(() => DocumentChunkEntity, (docChunk) => docChunk.workspace, {
    cascade: true,
  })
  documentChunks: DocumentChunkEntity[];
}
