import { JSX } from 'react';
import { SubmitHandler } from 'react-hook-form-mui';

import { useQueryContext } from '@/contexts/QueryContext';
import { QueryFormValues } from '@/contexts/submission-process';

import { QueryFormController } from './QueryFormController';

export const QueryForm = (): JSX.Element => {
    const queryContext = useQueryContext();

    // Use context's onSubmit instead of custom handleSubmit logic
    const handleSubmit: SubmitHandler<QueryFormValues> = async (data) => {
        console.log('[DEBUG] QueryForm handleSubmit called with data:', data);
        try {
            await queryContext.onSubmit(data);
            console.log('[DEBUG] QueryForm onSubmit completed successfully');
        } catch (error) {
            console.error('[DEBUG] QueryForm onSubmit failed:', error);
            throw error;
        }
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
