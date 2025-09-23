import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { SchemaToolCall } from '@/api/playgroundApi/playgroundApiSchema';
import { useAppContext } from '@/AppContext';
import {
    type FormContextWithContent,
    handleFormSubmitException,
} from '@/components/thread/QueryForm/handleFormSubmitException';
import { QueryFormValues } from '@/components/thread/QueryForm/QueryFormController';
import { useQueryContext } from '@/contexts/QueryContext';
import { useThreadView } from '@/pages/comparison/ThreadViewContext';

export interface ToolCallUserResponseFormValues {
    content: string;
    private: boolean;
    role: 'tool_call_result';
    toolCallId: SchemaToolCall['toolCallId'];
}

export const useToolCallUserResponse = <T extends { content: string }>(
    formContext: FormContextWithContent<T>
) => {
    const { threadViewId } = useThreadView();

    const queryContext = useQueryContext();

    const [isPending, setIsPending] = useState(false);

    const clearStreamError = useAppContext(useShallow((state) => state.clearStreamError));

    const submitToolCallResponse = async (data: QueryFormValues) => {
        setIsPending(true);

        try {
            clearStreamError(threadViewId);

            await queryContext.submitToThreadView(threadViewId, data);
        } catch (e) {
            handleFormSubmitException(e, formContext);
            console.error(e);
        } finally {
            setIsPending(false);
        }
    };

    return {
        submitToolCallResponse,
        isPending,
    };
};
