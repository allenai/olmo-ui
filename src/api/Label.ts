import { ClientBase } from './ClientBase';
import { PaginationData } from './Schema';

export const LabelApiUrl = '/v3/label';
export const LabelsApiUrl = '/v3/labels';

export enum LabelRating {
    Flag = -1,
    Negative,
    Positive,
}

export interface CreateLabelRequest {
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

const parseLabel = (label: JSONLabel): Label => {
    return {
        ...label,
        created: new Date(label.created),
        deleted: label.deleted ? new Date(label.deleted) : undefined,
    };
};

export class LabelClient extends ClientBase {
    createLabel = async (label: CreateLabelRequest): Promise<Label> => {
        const url = this.createURL(LabelApiUrl);
        const createLabelResponse = await this.fetch<JSONLabel>(url, {
            body: JSON.stringify(label),
            method: 'POST',
        });

        return parseLabel(createLabelResponse);
    };

    deleteLabel = async (labelId: string): Promise<void> => {
        const url = this.createURL(LabelApiUrl, labelId);
        return this.fetch(url, { method: 'DELETE' });
    };
}

interface GetAllLabelsRequest {
    pagination?: {
        offset: number;
        limit: number;
    };
    sort?: {
        field: string;
        order?: 'asc' | 'desc';
    };
    filter?: {
        creator?: string;
        message?: string;
        rating?: number;
    };
}

export interface GetAllLabelsResponse {
    labels: JSONLabel[];
    meta: PaginationData;
}

export class LabelsClient extends ClientBase {
    getAllLabels = async (request: GetAllLabelsRequest): Promise<LabelList> => {
        const url = this.createURL(LabelsApiUrl);

        // This will only work for one-level flattening. We may want to use something like lodash's flatten if we go deeper
        // This also assumes that we want to map request keys directly to search params. We'll want another solution if that isn't true anymore
        Object.values(request).forEach(
            (category: GetAllLabelsRequest[keyof GetAllLabelsRequest]) => {
                if (category == null) {
                    return;
                }

                Object.entries(category).forEach(([key, value]) => {
                    if (value != null) {
                        url.searchParams.set(key, value.toString());
                    }
                });
            }
        );

        const labelsResponse = await this.fetch<GetAllLabelsResponse>(url);
        const parsedLabels = labelsResponse.labels.map(parseLabel);

        return { labels: parsedLabels, meta: labelsResponse.meta };
    };
}
