import { ClientBase } from '../ClientBase';
import { search } from './search';

export class SearchClient extends ClientBase {
    private dolmaApiUrl = `${process.env.DOLMA_API_URL}/v1`;

    async search(q: search.Request): Promise<search.Response> {
        const url = `${this.dolmaApiUrl}/search?${search.toQueryString(q)}`;
        const resp = await fetch(url);
        return await this.unpack<search.Response>(resp);
    }

    async getMeta(): Promise<search.IndexMeta> {
        const url = `${this.dolmaApiUrl}/meta`;
        const resp = await fetch(url);
        return await this.unpack<search.IndexMeta>(resp);
    }

    async getDocument(id: string): Promise<search.Document> {
        const url = `${this.dolmaApiUrl}/document/${id}`;
        const resp = await fetch(url);
        return await this.unpack<search.Document>(resp);
    }
}
