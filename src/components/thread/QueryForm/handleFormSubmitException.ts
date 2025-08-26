import type { Path, UseFormReturn } from 'react-hook-form-mui';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { StreamBadRequestError, StreamValidationError } from '@/api/Message';

const INAPPROPRIATE_FORM_ERROR_CONFIGS = {
    inappropriate_prompt_text: {
        type: 'inappropriate' as const,
        message:
            'This prompt text was flagged as inappropriate. Please change your prompt text and resubmit.',
        analytics: () => {
            analyticsClient.trackInappropriatePrompt('text');
        },
    },
    inappropriate_prompt: {
        type: 'inappropriate' as const,
        message:
            'This prompt text was flagged as inappropriate. Please change your prompt text and resubmit.',
        analytics: () => {
            analyticsClient.trackInappropriatePrompt('text');
        },
    },
    inappropriate_prompt_file: {
        type: 'inappropriate' as const,
        message:
            'The submitted image was flagged as inappropriate. Please change your image and resubmit.',
        analytics: () => {
            analyticsClient.trackInappropriatePrompt('file');
        },
    },
    invalid_captcha: {
        type: 'recaptcha' as const,
        message: 'We were unable to verify your request. Please reload the page and try again.',
        analytics: undefined,
    },
    failed_captcha_assessment: {
        type: 'recaptcha' as const,
        message: 'Our systems have detected unusual traffic. Please log in to send new messages.',
        analytics: undefined,
    },
} as const;

export const isInappropriateFormError = (error: unknown): boolean => {
    if (error instanceof StreamBadRequestError) {
        if (error instanceof StreamValidationError) {
            return true;
        }

        return error.description != null && error.description in INAPPROPRIATE_FORM_ERROR_CONFIGS;
    }

    return false;
};

type FormContextWithContent<T extends { content: string }> = UseFormReturn<T>;

export const handleFormSubmitException = <T extends { content: string }>(
    e: unknown,
    formContext: FormContextWithContent<T>
) => {
    if (e instanceof StreamBadRequestError) {
        if (e instanceof StreamValidationError) {
            formContext.setError('content' as Path<T>, {
                type: 'validation',
                message: e.description,
            });
            return;
        }

        const config = e.description
            ? INAPPROPRIATE_FORM_ERROR_CONFIGS[
                  e.description as keyof typeof INAPPROPRIATE_FORM_ERROR_CONFIGS
              ]
            : undefined;

        if (config) {
            formContext.setError('content' as Path<T>, {
                type: config.type,
                message: config.message,
            });

            config.analytics?.(); // Track analytics if required for this error type
            return;
        }

        throw e;
    } else {
        throw e;
    }
};
