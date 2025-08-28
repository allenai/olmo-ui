import { useReCaptcha } from '@wojtekmaj/react-recaptcha-v3';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { useQueryContext } from '@/contexts/QueryContext';
import { useThreadView } from '@/pages/comparison/ThreadViewContext';

import { handleFormSubmitException } from '../../QueryForm/handleFormSubmitException';
import { QueryFormValues } from '../../QueryForm/QueryFormController';

export const useToolCallUserResponse = () => {
    const { executeRecaptcha } = useReCaptcha();
    const { threadViewId } = useThreadView();

    const queryContext = useQueryContext();

    const submitToolCallResponse = async (data: QueryFormValues) => {
        const isReCaptchaEnabled = process.env.IS_RECAPTCHA_ENABLED;

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
            handleFormSubmitException(e);
            console.error(e);
        }
    };

    return {
        submitToolCallResponse,
    };
};
