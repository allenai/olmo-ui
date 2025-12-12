import { css } from '@allenai/varnish-panda-runtime/css';
import { Alert, ButtonLink } from '@allenai/varnish-ui';

import { links } from '@/Links';

const TRACKING_UNAVAILABLE_MESSAGE = 'Tracking is not currently available.';
/**
 * This is a flag to hide the tracking message for external users.
 * An array of objects that specify which modelsIds to hide the display of tracking components.
 * Use modelId 'all' to hide tracking messages for all models.
 * Empty array means no models are hidden.
 */
export const HIDE_TRACKING_MESSAGES_CONFIG: {
    modelId: string;
    message: string;
    alternativeModelId?: string;
    actionText?: string;
}[] = [
    // remove this 'all' entry to start showing tracking for specific model IDs
    {
        modelId: 'all',
        message: TRACKING_UNAVAILABLE_MESSAGE,
    },

    // Example of hiding tracking message for a specific model ID
    {
        modelId: 'molmo2-4b-general',
        message: 'Tracking is not currently available for this model.',
        alternativeModelId: 'molmo2-8b-general',
        actionText: 'Try Molmo2 8B',
    },
];

export const getTrackingHiddenInfo = (selectedModelId: string | undefined) =>
    HIDE_TRACKING_MESSAGES_CONFIG.find(
        (info) => selectedModelId === info.modelId || info.modelId === 'all'
    );

/**
 * This component is used to display an alert when the tracking message is hidden for external users.
 * @param message - The message to display in the alert.
 * @param alternativeModelId - The model ID to link to in the alert if provided.
 * @returns ReactNode
 */
export const TrackingHiddenAlert = ({
    message,
    alternativeModelId,
    actionText,
}: Omit<(typeof HIDE_TRACKING_MESSAGES_CONFIG)[number], 'modelPrefix'>) => {
    return (
        <Alert
            severity="info"
            icon={false}
            action={
                alternativeModelId ? (
                    <ButtonLink
                        className={css({
                            whiteSpace: 'nowrap',
                        })}
                        size="small"
                        href={`${links.playground}?model=${alternativeModelId}`}>
                        {actionText ?? 'Go to Model'}
                    </ButtonLink>
                ) : undefined
            }
            className={css({
                display: 'flex',
                alignItems: 'center',
                gap: '4',
                backgroundColor: 'background.opacity-10',
                color: 'text.primary',
                marginBlock: '8',
            })}>
            {message}
        </Alert>
    );
};
