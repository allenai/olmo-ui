import { ClientBase } from './ClientBase';
import type { Model } from './playgroundApi/additionalTypes';

export const ModelApiUrl = '/v4/models';

export type ModelFamilyId = 'tulu' | 'olmo';

export type ModelList = Array<Model>;

export class ModelClient extends ClientBase {
    getAllModels = async (): Promise<ModelList> => {
        const url = this.createURL(ModelApiUrl);

        return await this.fetch(url);
    };
}
