import {
    GetObjectCommand,
    S3Client
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';

@Injectable()
export class S3Service {
    private client: S3Client;
    private bucket: string;

    constructor() {
        this.client = new S3Client({
            region: process.env['AWS_REGION'] as string,
            credentials: {
                accessKeyId: process.env['AWS_ACCESS_KEY_ID'] as string,
                secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'] as string,
            },
        });

        this.bucket = process.env['S3_BUCKET_NAME'] as string;
    }

    async getFile(key: string): Promise<Buffer> {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });

        const res = await this.client.send(command);
        const stream = res.Body as Readable;

        return this.streamToBuffer(stream);
    }

    streamToBuffer(stream: Readable): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const chunks: any[] = [];
            stream.on('data', (chunk) => chunks.push(chunk));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
            stream.on('error', reject);
        });
    }
}
