import { ClientBase } from './ClientBase';
import type {
    SchemaAttributionDocumentSnippet,
    SchemaResponseAttributionDocument,
    SchemaResponseAttributionSpan,
} from './playgroundApi/playgroundApiSchema';

export type AttributionDocumentSnippet = SchemaAttributionDocumentSnippet;

export type Document = SchemaResponseAttributionDocument;

export type AttributionSpan = SchemaResponseAttributionSpan;
export interface TopLevelAttributionSpan extends AttributionSpan {
    nested_spans: AttributionSpan[];
}

interface AttributionResponse {
    documents: Document[];
    spans: TopLevelAttributionSpan[];
    index: string;
}

const AttributionApiUrl = '/v3/attribution';

export class AttributionClient extends ClientBase {
    getAttributionDocuments = async (
        prompt: string,
        modelResponse: string,
        modelId: string,
        maxDocuments: number = 10
    ): Promise<AttributionResponse> => {
        const url = this.createURL(AttributionApiUrl);

        const request = {
            prompt,
            model_response: modelResponse,
            model_id: modelId,
            max_documents: maxDocuments,
        };

        return this.fetch(url, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
    };
}
