import Plausible from 'plausible-tracker';

import { AnalyticsEvent } from './AnalyticsClient';

const plausibleClient = Plausible({ domain: 'playground.allen.ai' });

type Primitive = string | number | boolean | undefined;

const flattenObject = <T extends Record<string, unknown>>(
    object?: T | null
): Record<string, Primitive> => {
    if (object == null) {
        return {};
    }

    const entries: Array<[string, unknown]> = Object.entries(object);

    const newObject = entries.reduce<Record<string, Primitive>>((acc, [key, value]) => {
        if (typeof value === 'object' && value != null) {
            return { ...acc, ...flattenObject(value as Record<string, unknown>) };
        } else {
            acc[key] = (value as Primitive) ?? undefined;
            return acc;
        }
    }, {});

    return newObject;
};

export const plausibleTrackEvent = (event: AnalyticsEvent): void => {
    try {
        plausibleClient.trackEvent(event.type, {
            props: { ...flattenObject(event.details), occurred: event.occurred.toISOString() },
        });
    } catch (e: unknown) {
        if (e instanceof Error) {
            console.error('Plausible failed to track an event: ' + e.message);
        }
    }
};

export const plausibleTrackPageview = plausibleClient.trackPageview;
