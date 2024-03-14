import { ClientBase } from '../ClientBase';
import { staticData } from './staticData';

export class StaticDataClient extends ClientBase {
    async getSources(): Promise<staticData.Sources> {
        const url = 'https://dolma.allen.ai/api/static/sources.json';
        const resp = await fetch(url);
        return await this.unpack<staticData.Sources>(resp);
    }

    async getWords(): Promise<staticData.BinnedBySource> {
        const url = '/api/static/words/data.json';
        const resp = await fetch(url);
        return await this.unpack<staticData.BinnedBySource>(resp);
    }

    async getCreated(): Promise<staticData.BinnedBySource> {
        const url = '/api/static/created/data.json';
        const resp = await fetch(url);
        return await this.unpack<staticData.BinnedBySource>(resp);
    }

    async getDomains(): Promise<staticData.DomainsBySource> {
        const url = '/api/static/domains/data.json';
        const resp = await fetch(url);
        return await this.unpack<staticData.DomainsBySource>(resp);
    }

    async getSourceCounts(): Promise<staticData.SourceCounts> {
        const url = '/api/static/source_counts/data.json';
        const resp = await fetch(url);
        return await this.unpack<staticData.SourceCounts>(resp);
    }
}
