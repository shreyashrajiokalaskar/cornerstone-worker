import { Injectable } from "@nestjs/common";
import { PDFParse } from 'pdf-parse';

@Injectable()
export class PdfService {
    async extractText(buffer: Buffer): Promise<string> {
        const pdf = new PDFParse({ data: buffer });

        const result = await pdf.getText();

        const cleaned = result.text
            .replace(/\s+/g, ' ')
            .trim();

        return cleaned;
    }

}
