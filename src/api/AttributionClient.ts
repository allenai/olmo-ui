import { ClientBase } from './ClientBase';

export interface Document {
    text: string;
    correspondingSpans: string[];
    index: string;
    source: string;
    title: string;
}

const AttributionApiUrl = '/v3/attribution';

export class AttributionClient extends ClientBase {
    getAttributionDocuments = async (
        modelResponse: string,
        modelId: string,
        maxDocuments: number = 10
    ): Promise<Record<string, Document>> => {
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
