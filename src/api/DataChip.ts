import { PaginationData } from './Schema';

export const DataChipApiUrl = `${process.env.LLMX_API_URL}/v3/datachip`;
export const DataChipsApiUrl = `${process.env.LLMX_API_URL}/v3/datachips`;

export interface DataChipPost {
    name: string;
    content: string;
}

export interface DataChipPatch {
    deleted?: boolean;
}

export interface DataChip {
    id: string;
    name: string;
    content: string;
    creator: string;
    created: Date;
    deleted?: Date;
}

export interface DataChipList {
    dataChips: DataChip[];
    meta: PaginationData;
}

export interface JSONDataChipList {
    datachips: JSONDataChip[];
    meta: PaginationData;
}

// The serialized representation, where certain fields (dates) are encoded as strings.
export interface JSONDataChip extends Omit<DataChip, 'created' | 'deleted'> {
    created: string;
    deleted?: string;
}

export const parseDataChip = (chip: JSONDataChip): DataChip => {
    return {
        ...chip,
        created: new Date(chip.created),
        deleted: chip.deleted ? new Date(chip.deleted) : undefined,
    };
};
