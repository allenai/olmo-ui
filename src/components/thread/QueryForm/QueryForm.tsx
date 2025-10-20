import { JSX } from 'react';

import { useQueryContext } from '@/contexts/QueryContext';

import { QueryFormController } from './QueryFormController';

export const QueryForm = (): JSX.Element => {
    const queryContext = useQueryContext();

    return (
        <QueryFormController
            {...queryContext}
            handleSubmit={queryContext.onSubmit}
            canEditThread={queryContext.canSubmit}
        />
    );
};
