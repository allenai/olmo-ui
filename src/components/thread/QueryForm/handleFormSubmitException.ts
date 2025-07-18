import type { UseFormReturn } from 'react-hook-form-mui';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { StreamBadRequestError, StreamValidationError } from '@/api/Message';

import { QueryFormValues } from './QueryFormController';

export const handleFormSubmitException = (
    e: unknown,
    formContext: UseFormReturn<QueryFormValues>
) => {
    if (e instanceof StreamBadRequestError) {
        if (e instanceof StreamValidationError) {
            formContext.setError('content', {
                type: 'validation',
                message: e.description,
            });
            return;
        }

        switch (e.description) {
            case 'inappropriate_prompt_text':
            case 'inappropriate_prompt': // fallthrough
                formContext.setError('content', {
                    type: 'inappropriate',
                    message:
                        'This prompt text was flagged as inappropriate. Please change your prompt text and resubmit.',
                });
                analyticsClient.trackInappropriatePrompt('text');
                return;

            case 'inappropriate_prompt_file':
                formContext.setError('content', {
                    type: 'inappropriate',
                    message:
                        'The submitted image was flagged as inappropriate. Please change your image and resubmit.',
                });
                analyticsClient.trackInappropriatePrompt('file');
                return;

            case 'invalid_captcha':
                formContext.setError('content', {
                    type: 'recaptcha',
                    message:
                        'We were unable to verify your request. Please reload the page and try again.',
                });
                return;

            case 'failed_captcha_assessment':
                formContext.setError('content', {
                    type: 'recaptcha',
                    message:
                        'Our systems have detected unusual traffic. Please log in to send new messages.',
                });
                return;

            default:
                throw e;
        }
    } else {
        throw e;
    }
};
