import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DocumentChunkEntity } from 'src/db/entities/document-chunk.entity';
import { DocumentVectorEntity } from 'src/db/entities/document-vector.entity';
import { DocumentEntity } from 'src/db/entities/document.entity';
import { UserAuthEntity } from 'src/db/entities/user-auth.entity';
import { UserEntity } from 'src/db/entities/user.entity';
import { WorkspaceEntity } from 'src/db/entities/workspace.entity';

export const typeOrmConfig = (config: ConfigService): TypeOrmModuleOptions => {
  console.log({
    type: 'postgres',
    host: config.get('DB_HOST'),
    port: +config.get('DB_PORT'),
    username: config.get('DB_USER'),
    password: config.get('DB_PASSWORD'),
    database: config.get('DB_NAME'),
    autoLoadEntities: true,
    synchronize: false,
    logging: false,
  })
  return {
    type: 'postgres',
    host: config.get('DB_HOST'),
    port: +config.get('DB_PORT'),
    username: config.get('DB_USER'),
    password: config.get('DB_PASSWORD'),
    database: config.get('DB_NAME'),
    entities: [DocumentVectorEntity, DocumentChunkEntity, DocumentEntity, UserEntity, UserAuthEntity, WorkspaceEntity],
    synchronize: false,
    logging: false,
  }
};
