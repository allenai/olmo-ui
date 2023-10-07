import { dolma } from './dolma';
import { error } from './error';

function login() {
    document.location = `${self.origin}/v3/login/skiff`;
}

async function processResponse<T>(response: Response): Promise<T> {
    switch (response.status) {
        case 200:
            return await response.json();
        case 401:
            login();
            // This shouldn't ever happen
            throw new Error('Unauthorized');
        default:
            throw await error.unpack(response);
    }
}

export class Client {
    constructor(readonly origin = process.env.LLMX_API_URL) {}

    async search(query: string, offset = 0, size = 10): Promise<dolma.search.Results> {
        const url = `${this.origin}/v3/data/search?${dolma.search.toQueryString(
            query,
            offset,
            size
        )}`;
        const resp = await fetch(url, { credentials: 'include' });
        return await processResponse<dolma.search.Results>(resp);
    }

    async indexMeta(): Promise<dolma.search.IndexMeta> {
        const url = `${this.origin}/v3/data/meta`;
        const resp = await fetch(url, { credentials: 'include' });
        return await processResponse<dolma.search.IndexMeta>(resp);
    }

    async doc(id: string): Promise<dolma.Doc> {
        const url = `${this.origin}/v3/data/doc/${id}`;
        const resp = await fetch(url, { credentials: 'include' });
        return await processResponse<dolma.Doc>(resp);
    }
}
