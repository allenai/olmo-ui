import { ClientBase } from './ClientBase';

export const ModelApiUrl = '/v3/models';

export interface Model {
    description: string;
    id: string;
    name: string;
    host: string;
    model_type?: string;
}

export type ModelList = Model[];

export class ModelClient extends ClientBase {
    getAllModels = async (): Promise<ModelList> => {
        const url = this.createURL(ModelApiUrl);

        return await this.fetch(url);
    };
}
