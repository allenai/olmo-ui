import { ClientBase } from './ClientBase';

export const ModelApiUrl = '/v3/models';

export type ModelFamilyId = 'tulu' | 'olmo';

export type FileRequiredToPromptOption = 'first_message' | 'all_messages' | 'no_requirement';

export interface Model {
    description: string;
    id: string;
    name: string;
    host: string;
    model_type: string;
    is_deprecated: boolean;
    accepts_files: boolean;
    family_id?: ModelFamilyId;
    family_name?: string;
    accepted_file_types?: string[];
    max_files_per_message?: number;
    require_file_to_prompt?: FileRequiredToPromptOption;
    max_total_file_size?: number;
    allow_files_in_followups?: boolean;
}

export type ModelList = Model[];

export class ModelClient extends ClientBase {
    getAllModels = async (): Promise<ModelList> => {
        const url = this.createURL(ModelApiUrl);

        return await this.fetch(url);
    };
}
