import { JSX } from 'react';

import { useQueryContext } from '@/contexts/QueryContext';

import { QueryFormController } from './QueryFormController';

export const QueryForm = (): JSX.Element => {
    const queryContext = useQueryContext();

    return (
        <QueryFormController
            handleSubmit={queryContext.onSubmit}
            placeholderText={queryContext.placeholderText}
            areFilesAllowed={queryContext.areFilesAllowed}
            autofocus={queryContext.autofocus}
            canEditThread={queryContext.canSubmit}
            onAbort={queryContext.onAbort}
            canPauseThread={queryContext.canPauseThread}
            isLimitReached={queryContext.isLimitReached}
            remoteState={queryContext.remoteState}
            fileUploadProps={queryContext.fileUploadProps}
        />
    );
};
