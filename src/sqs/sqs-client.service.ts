import { ChangeMessageVisibilityCommand, DeleteMessageCommand, Message, ReceiveMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SqsClientService {
    client: SQSClient;
    private queueUrl: string;

    constructor() {
        this.client = new SQSClient({
            region: process.env['AWS_REGION'] as string,
            credentials: {
                accessKeyId: process.env['SQS_ACCESS_KEY_ID'] as string,
                secretAccessKey: process.env['SQS_SECRET_ACCESS_KEY'] as string,
            },
        });

        this.queueUrl = process.env['DOC_QUEUE_URL'] as string;


        console.log('SQS connected to:', this.queueUrl);
    }

    async receiveMessages(): Promise<Message[]> {
        const res = await this.client.send(new ReceiveMessageCommand({
            QueueUrl: this.queueUrl,
            MaxNumberOfMessages: 5,
            WaitTimeSeconds: 20,
            VisibilityTimeout: 60, // seconds
        }))

        return res.Messages || [];
    }

    async deleteMessage(receiptHandle: string) {
        return await this.client.send(new DeleteMessageCommand({
            QueueUrl: this.queueUrl,
            ReceiptHandle: receiptHandle,
        }))
    }

    async extendVisibility(receiptHandle: string, timeout: number) {
        await this.client.send(new ChangeMessageVisibilityCommand({
            QueueUrl: this.queueUrl,
            ReceiptHandle: receiptHandle,
            VisibilityTimeout: timeout,
        }))
    }
}
