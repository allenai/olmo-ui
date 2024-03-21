import { ClientBase } from '../ClientBase';
import { staticData } from './staticData';

export class StaticDataClient extends ClientBase {
    staticFilePath = `${process.env.DOLMA_API_URL}/api/static`;

    #getData = async <TResponse>(filePath: string): Promise<TResponse> => {
        const url = `${this.staticFilePath}/${filePath}`;
        const response = await fetch(url);
        return this.unpack<TResponse>(response);
    };

    getSources = async (): Promise<staticData.Sources> => {
        return this.#getData('/sources.json');
    };

    getWords = async (): Promise<staticData.BinnedBySource> => {
        return this.#getData('/words/data.json');
    };

    getCreated = async (): Promise<staticData.BinnedBySource> => {
        return this.#getData('/created/data.json');
    };

    getDomains = async (): Promise<staticData.DomainsBySource> => {
        return this.#getData('/domains/data.json');
    };

    getSourceCounts = async (): Promise<staticData.SourceCounts> => {
        return this.#getData('/source_counts/data.json');
    };
}
