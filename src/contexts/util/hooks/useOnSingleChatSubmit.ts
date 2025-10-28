import { useCallback } from 'react';

import { useAppContext } from '@/AppContext';
import type { QueryFormValues } from '@/components/thread/QueryForm/QueryFormController';

export const useOnSingleChatSubmit = (
    prepareForNewSubmission: () => void,
    submitToThreadView: (threadViewId: string, data: QueryFormValues) => Promise<string | null>
) => {
    const clearStreamError = useAppContext((state) => state.clearStreamError);

    const onSubmit = useCallback(
        async (data: QueryFormValues): Promise<void> => {
            // this should not be assumed
            // TODO: Fix comparison (all of it)
            const threadViewId = '0';

            // Clear stream errors on new submission
            clearStreamError(threadViewId);

            prepareForNewSubmission();

            await submitToThreadView(threadViewId, data);
        },
        [clearStreamError, prepareForNewSubmission, submitToThreadView]
    );

    return onSubmit;
};
