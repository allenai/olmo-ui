import { ClientBase } from './ClientBase';
import { dolma } from './dolma';

export class DolmaClient extends ClientBase {
    async searchDolma(query: string, offset = 0, size = 10): Promise<dolma.search.Results> {
        const url = `${this.origin}/v3/data/search?${dolma.search.toQueryString(
            query,
            offset,
            size
        )}`;
        const resp = await fetch(url, { credentials: 'include' });
        return await this.unpack<dolma.search.Results>(resp);
    }

    async getDolmaIndexMeta(): Promise<dolma.search.IndexMeta> {
        const url = `${this.origin}/v3/data/meta`;
        const resp = await fetch(url, { credentials: 'include' });
        return await this.unpack<dolma.search.IndexMeta>(resp);
    }

    async getDolmaDocument(id: string): Promise<dolma.Document> {
        const url = `${this.origin}/v3/data/doc/${id}`;
        const resp = await fetch(url, { credentials: 'include' });
        return await this.unpack<dolma.Document>(resp);
    }
}
