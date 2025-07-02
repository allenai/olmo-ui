import { analyticsClient } from '@/analytics/AnalyticsClient';
import { QueryFormValues } from '@/components/thread/QueryForm/QueryFormController';
import { StreamMessageRequest } from '@/slices/ThreadUpdateSlice';

export const validateSubmission = (canSubmit: boolean, isLoading: boolean): boolean => {
    if (!canSubmit || isLoading) {
        return false;
    }
    return true;
};

export const setupRecaptcha = async (
    executeRecaptcha?: ((action?: string) => Promise<string> | null) | null
): Promise<string | undefined> => {
    if (process.env.IS_RECAPTCHA_ENABLED !== 'true') return undefined;

    if (!executeRecaptcha) {
        analyticsClient.trackCaptchaNotLoaded();
        return undefined;
    }

    const result = executeRecaptcha('prompt_submission');
    return result instanceof Promise ? await result : undefined;
};

export const prepareRequest = (
    data: QueryFormValues,
    captchaToken: string | undefined,
    lastMessageId?: string
): StreamMessageRequest => {
    const request: StreamMessageRequest = { ...data, captchaToken };

    // Add parent message ID if continuing an existing thread
    if (lastMessageId) request.parent = lastMessageId;

    return request;
};

export const executeStreamPrompt = async (_request: StreamMessageRequest): Promise<void> => {
    // TODO: Implement streaming logic
    return Promise.resolve();
};

export const trackSubmissionAnalytics = (_modelId: string, _isPlayground: boolean): void => {
    // TODO: Implement analytics tracking
};

export const handleSubmissionError = (_error: unknown): void => {
    // TODO: Implement error handling
};
