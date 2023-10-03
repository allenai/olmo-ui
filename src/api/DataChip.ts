export interface DataChip {
    id: string;
    name: string;
    content: string;
    creator: string;
    created: Date;
    deleted?: Date;
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
