import { Message } from "@aws-sdk/client-sqs";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { IMessageJob } from "src/common/common.interface";
import { WorkerService } from "src/worker/worker.service";
import { SqsClientService } from "./sqs-client.service";

@Injectable()
export class SqsConsumerService implements OnModuleInit {
    private readonly logger = new Logger(SqsConsumerService.name);

    constructor(private readonly sqsClientService: SqsClientService, private readonly workerService: WorkerService) {

    }

    onModuleInit() {
        this.logger.log('Starting SQS consumer polling...');
        this.poll();
    }

    async poll() {
        while (true) {
            try {
                const messages = await this.sqsClientService.receiveMessages();

                for (const msg of messages) {
                    await this.processMessage(msg);
                }
            } catch (error) {
                this.logger.error('SQS polling error', error);
                await this.sleep(5000); // backoff on failure
            }
        }
    }

    async processMessage(message: Message) {
        try {
            const job: IMessageJob = JSON.parse(message.Body as string);
            this.logger.log(`Processing document ${job.documentId}`);
            await this.workerService.processDocument(job)
            await this.sqsClientService.deleteMessage(message.ReceiptHandle as string);
        } catch (err) {
            this.logger.error('Job failed', err);
        }
    }

    async sleep(ms: number) {
        return new Promise((r) => setTimeout(r, ms));
    }
}
