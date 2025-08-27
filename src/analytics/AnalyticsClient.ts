import { plausibleTrackEvent, plausibleTrackPageview } from './plausible';

export enum EventType {
    SearchQuery = 'search.query',
    SearchResultClick = 'search.result.click',
    DocumentView = 'document.view',
    DocumentShare = 'document.share',
    NewPrompt = 'prompt.new',
    FollowUpPrompt = 'prompt.followup',
    ParametersUpdate = 'prompt.parameters.update',
    ModelUpdate = 'prompt.model.update',
    ExternalNavigationLinkClick = 'navigation.external',
    ColorModeChange = 'color.mode.change',
    ModelOverloadedError = 'model.overloaded.error',
    // ----- HEAP -----
    PromptErrorInappropriate = 'prompt.error.inappropriate',
    PromptErrorInappropriateText = 'prompt.error.inappropriate.text',
    PromptErrorInappropriateFile = 'prompt.error.inappropriate.file',
    QueryFormSubmit = 'queryform.submit',
    PromptOlmoTrace = 'prompt.corpuslink',
    CaptchaError = 'queryform.captcha-error',
    CaptchaNotLoaded = 'queryform.captcha-not-loaded',
}

export type PromptMessageDetails = {
    threadId: string;
};

export interface AnalyticsEvent {
    type: EventType;
    occurred: Date;
    details?: PromptMessageDetails | Record<string, unknown>;
}

const generatePlausibleEvent = (et: EventType, details?: object): AnalyticsEvent => {
    return {
        type: et,
        occurred: new Date(),
        ...(details || {}),
    };
};

export class AnalyticsClient {
    /**
     * Enqueues an event to be tracked and returns true upon it being enqueued.
     * This does not block for the request to be sent (or for a response to be received).
     * Rather it enqueues the request for eventual, background delivery by the browser.
     * See https://developer.mozilla.org/en-US/docs/Web/API/Beacon_API
     */
    track(et: EventType, details?: object): boolean {
        try {
            if (process.env.IS_ANALYTICS_ENABLED === 'true') {
                if (window.heap?.track != null) {
                    window.heap.track(et, details);
                }

                const event = generatePlausibleEvent(et, details);
                plausibleTrackEvent(event);

                const data = new Blob([JSON.stringify(event)], { type: 'application/json' });
                return navigator.sendBeacon('/api/v1/event', data);
            } else {
                console.log('Track event', details);
                return true;
            }
        } catch (e: unknown) {
            console.error('Something went wrong when sending analytics', e);
            return false;
        }
    }

    trackNewPrompt(): boolean {
        return this.track(EventType.NewPrompt);
    }

    trackFollowUpPrompt(details: PromptMessageDetails): boolean {
        return this.track(EventType.FollowUpPrompt, details);
    }

    trackPageView(url: string): void {
        plausibleTrackPageview({ url });
    }

    trackParametersUpdate(details: { parameterUpdated: string }): boolean {
        return this.track(EventType.ParametersUpdate, details);
    }

    trackModelUpdate(details: { modelChosen: string }): boolean {
        return this.track(EventType.ModelUpdate, details);
    }

    trackExternalNavigationLinkClick(details: { url: string }): boolean {
        return this.track(EventType.ExternalNavigationLinkClick, details);
    }

    trackColorModeChange(details: { colorMode: string }): boolean {
        return this.track(EventType.ColorModeChange, details);
    }

    trackModelOverloadedError(modelId: string): boolean {
        return this.track(EventType.ModelOverloadedError, { modelId });
    }

    trackQueryFormSubmission(modelId: string, isNewThread: boolean) {
        this.track(EventType.QueryFormSubmit, {
            model: modelId,
            isNewThread,
        });
    }

    trackInappropriatePrompt(type?: string) {
        const eventType = (() => {
            if (type === 'text') {
                return EventType.PromptErrorInappropriateText;
            }
            if (type === 'file') {
                return EventType.PromptErrorInappropriateFile;
            }

            return EventType.PromptErrorInappropriate;
        })();

        this.track(eventType);
    }

    trackPromptOlmoTrace(modelId: string, isEnabling: boolean) {
        this.track(EventType.PromptOlmoTrace, {
            model: modelId,
            isEnabling,
        });
    }

    trackCaptchaError(errorTypes: string[]) {
        this.track(EventType.CaptchaError, { types: errorTypes });
    }

    trackCaptchaNotLoaded() {
        this.track(EventType.CaptchaNotLoaded);
    }
}

export const analyticsClient = new AnalyticsClient();
