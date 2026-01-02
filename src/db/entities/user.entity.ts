import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './common.entity';
import { UserAuthEntity } from './user-auth.entity';
import { WorkspaceEntity } from './workspace.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => UserAuthEntity, (auth) => auth.user)
  authProviders: UserAuthEntity[];

  @OneToMany(() => WorkspaceEntity, (workspace) => workspace.owner, {
    cascade: true,
  })
  workspaces: WorkspaceEntity[];
}
