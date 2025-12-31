import { Injectable, Logger } from "@nestjs/common";
import { IMessageJob } from "src/common/common.interface";
import { PdfService } from "src/pdf/pdf.service";
import { S3Service } from "src/s3/s3-client.service";

@Injectable()
export class WorkerService {
    private readonly logger = new Logger(WorkerService.name);

    constructor(private s3Service: S3Service, private pdfService: PdfService) { }

    async processDocument(job: IMessageJob) {
        this.logger.log(`Worker processing document ${job.documentId} from S3 key ${job.key}`);
        const file = await this.s3Service.getFile(job.key);
        this.logger.log(`Fetched file of size ${file.length} bytes for document ${job.documentId}`);

        const text = await this.pdfService.extractText(file);

        this.logger.log(`Chunking text`);

        const chunks = this.chunk(text);

        this.logger.log(`Generating embeddings (${chunks.length} chunks)`);
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
