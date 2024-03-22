import { ClientBase } from '../ClientBase';
import { search } from './search';

export class SearchClient extends ClientBase {
    async search(q: search.Request): Promise<search.Response> {
        console.log('hitting search method');
        const url = `/api/v1/search?${search.toQueryString(q)}`;
        const resp = await fetch(url);
        return await this.unpack<search.Response>(resp);
    }

    async getMeta(): Promise<search.IndexMeta> {
        const url = '/api/v1/meta';
        const resp = await fetch(url);
        return await this.unpack<search.IndexMeta>(resp);
    }

    async getDocument(id: string): Promise<search.Document> {
        const url = `/api/v1/document/${id}`;
        const resp = await fetch(url);
        return await this.unpack<search.Document>(resp);
    }
}
