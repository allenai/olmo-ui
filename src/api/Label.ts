import { PaginationData } from './Schema';

export const LabelApiUrl = `${process.env.LLMX_API_URL}/v3/label`;
export const LabelsApiUrl = `${process.env.LLMX_API_URL}/v3/labels`;

export enum LabelRating {
    Flag = -1,
    Negative,
    Positive,
}

export interface LabelPost {
    message: string;
    rating: LabelRating;
    comment?: string;
}

export interface Label {
    id: string;
    created: Date;
    creator: string;
    deleted?: Date;
    message: string;
    rating: LabelRating;
    comment?: string;
}

export interface LabelList {
    labels: Label[];
    meta: PaginationData;
}

// The serialized representation, where certain fields (dates) are encoded as strings.
export interface JSONLabel extends Omit<Label, 'created' | 'deleted'> {
    created: string;
    deleted?: string;
}

export interface JSONLabelList {
    labels: JSONLabel[];
    meta: PaginationData;
}

export const parseLabel = (label: JSONLabel): Label => {
    return {
        ...label,
        created: new Date(label.created),
        deleted: label.deleted ? new Date(label.deleted) : undefined,
    };
};
