import { Model } from '@/api/playgroundApi/additionalTypes';

interface FileUploadDef {
    acceptsFileUpload: boolean;
    acceptedFileTypes: Set<string>;
    requiredFileOption?: string;
    acceptsMultiple: boolean;
    allowFilesInFollowups: boolean;
}

export const DEFAULT_FILE_UPLOAD_PROPS: FileUploadDef = {
    acceptsFileUpload: false,
    acceptedFileTypes: new Set<string>(),
    requiredFileOption: undefined,
    acceptsMultiple: false,
    allowFilesInFollowups: false,
};

export const convertToFileUploadProps = (model?: Model): FileUploadDef => {
    const baseProps: FileUploadDef = {
        ...DEFAULT_FILE_UPLOAD_PROPS,
        acceptsFileUpload: model?.accepts_files ?? false,
    };
    if (model?.prompt_type === 'multi_modal') {
        baseProps.acceptsMultiple =
            model.max_files_per_message != null && model.max_files_per_message > 1;
        baseProps.requiredFileOption = model.require_file_to_prompt;
        baseProps.allowFilesInFollowups = model.allow_files_in_followups ?? false;
        baseProps.acceptedFileTypes = new Set(model.accepted_file_types);
    }

    return baseProps;
};
