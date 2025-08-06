import { Model } from '@/api/playgroundApi/additionalTypes';
import { CompareModelState } from '@/slices/CompareModelSlice';

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

export const mapCompareFileUploadProps = (
    selectedCompareModels: CompareModelState[]
): FileUploadDef[] => {
    const mappedProps = selectedCompareModels.map(({ model }) => {
        return convertToFileUploadProps(model);
    });
    return mappedProps;
};

export const reduceCompareFileUploadProps = (compareFileUploadProps: FileUploadDef[]) => {
    const reducedProps = compareFileUploadProps.reduce((combinedValues, model) => {
        combinedValues.acceptsFileUpload &&= model.acceptsFileUpload;
        combinedValues.acceptsMultiple &&= model.acceptsMultiple;
        combinedValues.requiredFileOption &&= model.requiredFileOption;
        combinedValues.allowFilesInFollowups &&= model.allowFilesInFollowups;
        combinedValues.acceptedFileTypes = combinedValues.acceptedFileTypes.intersection(
            model.acceptedFileTypes
        );
        return combinedValues;
    });

    return reducedProps;
};
