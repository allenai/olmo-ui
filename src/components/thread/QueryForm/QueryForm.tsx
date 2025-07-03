import { JSX } from 'react';
import { SubmitHandler } from 'react-hook-form-mui';

import { useQueryContext } from '@/contexts/QueryContext';
import { QueryFormValues } from '@/contexts/submission-process';

import { QueryFormController } from './QueryFormController';

export const QueryForm = (): JSX.Element => {
    const queryContext = useQueryContext();

    // Use context's onSubmit instead of custom handleSubmit logic
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
            shouldResetForm={queryContext.shouldResetForm}
            fileUploadProps={queryContext.fileUploadProps}
        />
    );
};
