import { JSX } from 'react';
import { SubmitHandler } from 'react-hook-form-mui';

import { useQueryContext } from '@/contexts/QueryContext';

import { QueryFormController, QueryFormValues } from './QueryFormController';

interface QueryFormProps {
    shouldResetForm?: boolean;
}

export const QueryForm = ({ shouldResetForm }: QueryFormProps): JSX.Element => {
    const queryContext = useQueryContext();

    const handleSubmit: SubmitHandler<QueryFormValues> = async (data) => {
        await queryContext.onSubmit(data);
    };

    return (
        <QueryFormController
            handleSubmit={handleSubmit}
            placeholderText={queryContext.placeholderText}
            areFilesAllowed={queryContext.areFilesAllowed}
            autofocus={queryContext.autofocus}
            canEditThread={queryContext.canSubmit}
            onAbort={queryContext.onAbort}
            canPauseThread={queryContext.canPauseThread}
            isLimitReached={queryContext.isLimitReached}
            remoteState={queryContext.remoteState}
            shouldResetForm={shouldResetForm}
            fileUploadProps={queryContext.fileUploadProps}
        />
    );
};
