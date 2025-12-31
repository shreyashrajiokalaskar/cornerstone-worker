import { Injectable } from "@nestjs/common";
import OpenAI from "openai";

@Injectable()
export class EmbeddingService {
    private openAi: OpenAI;

    constructor() {
        this.openAi = new OpenAI({
            apiKey: process.env['OPENAI_API_KEY'] as string,
        })
    }
}
