import {
    GetObjectCommand,
    S3Client
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

@Injectable()
export class S3Service {
    private client: S3Client;
    private bucket: string;

    constructor(private config: ConfigService) {
        this.client = new S3Client({
            region: this.config.get('AWS_REGION') as string,
            credentials: {
                accessKeyId: this.config.get('AWS_ACCESS_KEY_ID') as string,
                secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY') as string,
            },
        });

        this.bucket = this.config.get('S3_BUCKET_NAME') as string;
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
