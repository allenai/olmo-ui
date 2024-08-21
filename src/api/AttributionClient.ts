import { ClientBase } from './ClientBase';

export interface Document {
    text: string;
    corresponding_spans: string[];
    corresponding_span_texts: string[];
    index: string;
    source: string;
    title: string;
}

export interface AttributionSpan {
    text: string;
    documents: number[];
}

export interface TopLevelAttributionSpan extends AttributionSpan {
    nested_spans: AttributionSpan[];
}

interface AttributionResponse {
    documents: { [documentIndex: string]: Document };
    spans: { [span: string]: AttributionSpan };
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
