import { useReCaptcha } from '@wojtekmaj/react-recaptcha-v3';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { SchemaToolCall } from '@/api/playgroundApi/playgroundApiSchema';
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
    const { executeRecaptcha } = useReCaptcha();
    const { threadViewId } = useThreadView();

    const queryContext = useQueryContext();

    const submitToolCallResponse = async (data: QueryFormValues) => {
        const isReCaptchaEnabled = process.env.VITE_IS_RECAPTCHA_ENABLED;

        if (isReCaptchaEnabled === 'true' && executeRecaptcha == null) {
            analyticsClient.trackCaptchaNotLoaded();
        }

        // TODO: Make sure executeRecaptcha is present when we require recaptchas
        const token =
            isReCaptchaEnabled === 'true'
                ? await executeRecaptcha?.('user_tool_response')
                : undefined;

        try {
            await queryContext.submitToThreadView(threadViewId, {
                ...data,
                captchaToken: token,
            });
        } catch (e) {
            handleFormSubmitException(e, formContext);
            console.error(e);
        }
    };

    return {
        submitToolCallResponse,
    };
};
