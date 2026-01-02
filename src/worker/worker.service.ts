import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IMessageJob } from "src/common/common.interface";
import { DOC_STATUS } from "src/config/common.constant";
import { DocumentChunkEntity } from "src/db/entities/document-chunk.entity";
import { DocumentEntity } from "src/db/entities/document.entity";
import { EmbeddingService } from "src/embeddings/embeddings.service";
import { PdfService } from "src/pdf/pdf.service";
import { S3Service } from "src/s3/s3-client.service";
import { Repository } from "typeorm";

@Injectable()
export class WorkerService {
    private readonly logger = new Logger(WorkerService.name);

    constructor(private s3Service: S3Service, private pdfService: PdfService, private embeddingService: EmbeddingService, @InjectRepository(DocumentChunkEntity) private documentVectorRepo: Repository<DocumentChunkEntity>, @InjectRepository(DocumentEntity) private documentRepo: Repository<DocumentEntity>
    ) { }

    async processDocument(job: IMessageJob) {
        this.logger.log(`Worker processing document ${job.documentId} from S3 key ${job.key}`);
        const file = await this.s3Service.getFile(job.key);
        this.logger.log(`Fetched file of size ${file.length} bytes for document ${job.documentId}`);

        const text = await this.pdfService.extractText(file);

        this.logger.log(`Chunking text`);

        const chunks = this.chunk(text);

        this.logger.log(`Generating embeddings (${chunks.length} chunks)`);

        const vectors = await this.embeddingService.embedMany(chunks);

        const records: DocumentChunkEntity[] = vectors.map((embedding, index) => {
            return this.documentVectorRepo.create({
                documentId: job.documentId,
                workspaceId: job.workspaceId,
                content: chunks[index],
                embedding
            })
        })

        await this.documentVectorRepo.save(records);

        this.logger.log(`Saved ${records.length} document vectors for document ${job.documentId}`);

        await this.documentRepo.update({ id: job.documentId }, { status: DOC_STATUS.COMPLETED })
    }

    private chunk(text: string): string[] {
        const size = 1000;
        const overlap = 200;
        const chunks: string[] = [];

        for (let i = 0; i < text.length; i += size - overlap) {
            chunks.push(text.slice(i, i + size));
        }

        return chunks;
    }
}
