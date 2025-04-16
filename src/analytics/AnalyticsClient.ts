import { search } from '../api/dolma/search';
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
    TermsLogOut = 'terms.logout',
    ColorModeChange = 'color.mode.change',
    ModelOverloadedError = 'model.overloaded.error',
    // ----- HEAP -----
    PromptErrorInappropriate = 'prompt.error.inappropriate',
    PromptErrorInappropriateText = 'prompt.error.inappropriate.text',
    PromptErrorInappropriateFile = 'prompt.error.inappropriate.file',
    QueryFormSubmit = 'queryform.submit',
    PromptOlmoTrace = 'prompt.corpuslink',
    CaptchaError = 'queryform.captcha-error',
}

export type SearchQueryDetails = {
    request: search.Request;
    response: { meta: search.Meta };
};

export type SearchResultClickDetails = {
    id: string;
    request: search.Request;
    source: search.Source;
    index: number;
};

export type DocumentEventDetails = {
    id: string;
    source: search.Source;
    query?: string;
};

export type PromptMessageDetails = {
    threadId: string;
};

export interface AnalyticsEvent {
    type: EventType;
    occurred: Date;
    details?:
        | SearchQueryDetails
        | SearchResultClickDetails
        | DocumentEventDetails
        | PromptMessageDetails
        | Record<string, unknown>;
}

const generatePlausibleEvent = (et: EventType, details?: any): AnalyticsEvent => {
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
    track(et: EventType, details?: any) {
        window.heap?.track(et, details);
        plausibleTrackEvent(generatePlausibleEvent(et, details));

        const data = new Blob([JSON.stringify(et)], { type: 'application/json' });
        return navigator.sendBeacon('/api/v1/event', data);
    }

    trackSearchQuery(details: SearchQueryDetails): boolean {
        return this.track(EventType.SearchQuery, details);
    }

    trackSearchResultClick(details: SearchResultClickDetails): boolean {
        return this.track(EventType.SearchResultClick, details);
    }

    trackDocumentView(details: DocumentEventDetails): boolean {
        return this.track(EventType.DocumentView, details);
    }

    trackDocumentShare(details: DocumentEventDetails): boolean {
        return this.track(EventType.DocumentShare, details);
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

    trackTermsLogOut(): boolean {
        return this.track(EventType.TermsLogOut);
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
}

export const analyticsClient = new AnalyticsClient();
