import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './config/typeorm.config';
import { DocumentChunkEntity } from './db/entities/document-chunk.entity';
import { DocumentEntity } from './db/entities/document.entity';
import { UserEntity } from './db/entities/user.entity';
import { EmbeddingService } from './embeddings/embeddings.service';
import { PdfService } from './pdf/pdf.service';
import { S3Service } from './s3/s3-client.service';
import { SqsClientService } from './sqs/sqs-client.service';
import { SqsConsumerService } from './sqs/sqs-consumer.service';
import { WorkerService } from './worker/worker.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    TypeOrmModule.forFeature([UserEntity, DocumentChunkEntity, DocumentEntity]),
  ],
  controllers: [AppController],
  providers: [AppService, WorkerService, SqsClientService, SqsConsumerService, S3Service, PdfService, EmbeddingService],
})
export class AppModule { }
