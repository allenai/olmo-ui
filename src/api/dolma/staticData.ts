// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace staticData {
    export enum StaticDataType {
        Words = 'words',
        Domains = 'domains',
        Created = 'created',
        SourceCounts = 'sourceCounts',
    }

    export interface Source {
        label: string;
        order: number;
        color: string;
        staticData: StaticDataType[];
    }

    export interface Sources {
        [id: string]: Source;
    }

    export interface BinnedData {
        doc_count: number;
        percentage: number;
        min: number;
        max: number;
    }

    export interface BinnedBySource {
        [id: string]: BinnedData[];
    }

    export interface Domains {
        [domain: string]: number;
    }

    export interface DomainsBySource {
        [id: string]: Domains;
    }

    export interface SourceCounts {
        [id: string]: number;
    }
}
