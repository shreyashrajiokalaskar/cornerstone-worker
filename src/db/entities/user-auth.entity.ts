import { AuthProvider } from "src/config/common.constant";
import { Column, Entity, ManyToOne, Unique } from "typeorm";
import { BaseEntity } from "./common.entity";
import { UserEntity } from "./user.entity";

@Entity('user_auth_providers')
@Unique(['provider', 'providerUserId'])
export class UserAuthEntity extends BaseEntity {

    @Column({
        type: 'enum',
        enum: AuthProvider
    })
    provider: AuthProvider;

    @Column()
    providerUserId: string;

    @Column({ nullable: true })
    passwordHash?: string;

    @ManyToOne(() => UserEntity, (user) => user.authProviders, { cascade: true })
    user: UserEntity;
}
