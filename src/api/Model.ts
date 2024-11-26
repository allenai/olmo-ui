import { ClientBase } from './ClientBase';

export const ModelApiUrl = '/v3/models';

export type ModelFamilyId = 'tulu' | 'olmo';

export interface Model {
    description: string;
    id: string;
    name: string;
    host: string;
    model_type: string;
    is_deprecated: boolean;
    family_id?: ModelFamilyId;
    family_name?: string;
}

export type ModelList = Model[];

export class ModelClient extends ClientBase {
    getAllModels = async (): Promise<ModelList> => {
        const url = this.createURL(ModelApiUrl);

        return await this.fetch(url);
    };
}
