import { ClientBase } from './ClientBase';

export interface Document {
    text: string;
    corresponding_spans: string[];
    index: string;
    source: string;
    title: string;
}

interface AttributionResponse {
    documents: Record<string, Document>;
    spans: Record<string, string[]>;
}

const AttributionApiUrl = '/v3/attribution?includeSpansInRoot=true';

export class AttributionClient extends ClientBase {
    getAttributionDocuments = async (
        modelResponse: string,
        modelId: string,
        maxDocuments: number = 10
    ): Promise<AttributionResponse> => {
        const url = this.createURL(AttributionApiUrl);

        const request = {
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
