import { useSuspenseQuery } from '@tanstack/react-query';

import { ClientBase } from './ClientBase';
import { playgroundApiQueryClient } from './playgroundApi/playgroundApiClient';
import {
    SchemaResponseModel,
    SchemaRootCreateModelConfigRequest,
} from './playgroundApi/playgroundApiSchema';

export const ModelApiUrl = '/v3/models';
export const ModelApiUrlv4 = '/v4/models/';

export type ModelFamilyId = 'tulu' | 'olmo';

export type FileRequiredToPromptOption = 'first_message' | 'all_messages' | 'no_requirement';

type BaseModel = {
    description: string;
    id: string;
    name: string;
    host: string;
    model_type: string;
    is_deprecated: boolean;
    accepts_files: boolean;
    family_id?: ModelFamilyId;
    family_name?: string;
};

type TextModel = BaseModel & {
    accepts_files: false;
};

type MultiModalModel = BaseModel & {
    accepts_files: true;
    accepted_file_types: string[];
    max_files_per_message?: number;
    require_file_to_prompt?: FileRequiredToPromptOption;
    max_total_file_size?: number;
    allow_files_in_followups?: boolean;
};

export type Model = TextModel | MultiModalModel;

export type ModelList = Array<Model>;

export class ModelClient extends ClientBase {
    getAllModels = async (): Promise<ModelList> => {
        const url = this.createURL(ModelApiUrl);

        return await this.fetch(url);
    };

    addModel = async (formData: SchemaRootCreateModelConfigRequest) => {
        const postNewModelQueryOptions = playgroundApiQueryClient.queryOptions(
            'post',
            ModelApiUrlv4,
            {
                body: formData,
            }
        );

        const { data, error, isSuccess, isError } = useSuspenseQuery(postNewModelQueryOptions);

        return { data: data as SchemaResponseModel | undefined, error, isSuccess, isError };
    };
}
