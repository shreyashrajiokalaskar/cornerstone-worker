import { ChangeMessageVisibilityCommand, DeleteMessageCommand, ListQueuesCommand, Message, ReceiveMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SqsClientService {
    client: SQSClient;
    private queueUrl: string;

    constructor(private config: ConfigService) {
        this.client = new SQSClient({
            region: this.config.get('AWS_REGION') as string,
            // credentials: {
            //     accessKeyId: this.config.get('SQS_ACCESS_KEY_ID') as string,
            //     secretAccessKey: this.config.get('SQS_SECRET_ACCESS_KEY') as string,
            // },

        });

        this.queueUrl = this.config.get('DOC_QUEUE_URL') as string;


        console.log('SQS connected to:', {
            accessKeyId: this.config.get('SQS_ACCESS_KEY_ID') as string,
            secretAccessKey: this.config.get('SQS_SECRET_ACCESS_KEY') as string,
            region: this.config.get('AWS_REGION') as string,
        });
        this.checkConnection

    }

    async checkConnection() {
        const data = await this.client.send(new ListQueuesCommand({}));
        console.log("Connected successfully. Queues:", data.QueueUrls);
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
