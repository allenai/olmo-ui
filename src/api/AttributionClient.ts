import { ClientBase } from './ClientBase';
export interface AttributionDocumentSnippet {
    text: string;
    corresponding_span_text: string;
}

export interface Document {
    text: string;
    text_long: string;
    snippets: AttributionDocumentSnippet[];
    corresponding_spans: number[];
    corresponding_span_texts: string[];
    index: string;
    url?: string;
    source: string;
    title?: string;
    relevance_score: number;
}

export interface AttributionSpan {
    text: string;
    documents: number[];
}

export interface TopLevelAttributionSpan extends AttributionSpan {
    nested_spans: AttributionSpan[];
}

interface AttributionResponse {
    documents: Document[];
    spans: TopLevelAttributionSpan[];
    index: string;
}

const AttributionApiUrl = '/v3/attribution?spansAndDocumentsAsList=true';

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
