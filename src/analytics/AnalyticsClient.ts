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

export class AnalyticsClient {
    /**
     * Enqueues an event to be tracked and returns true upon it being enqueued.
     * This does not block for the request to be sent (or for a response to be received).
     * Rather it enqueues the request for eventual, background delivery by the browser.
     * See https://developer.mozilla.org/en-US/docs/Web/API/Beacon_API
     */
    track(e: AnalyticsEvent): boolean {
        plausibleTrackEvent(e);

        const data = new Blob([JSON.stringify(e)], { type: 'application/json' });
        return navigator.sendBeacon('/api/v1/event', data);
    }

    trackSearchQuery(details: SearchQueryDetails): boolean {
        return this.track({ type: EventType.SearchQuery, occurred: new Date(), details });
    }

    trackSearchResultClick(details: SearchResultClickDetails): boolean {
        return this.track({ type: EventType.SearchResultClick, occurred: new Date(), details });
    }

    trackDocumentView(details: DocumentEventDetails): boolean {
        return this.track({ type: EventType.DocumentView, occurred: new Date(), details });
    }

    trackDocumentShare(details: DocumentEventDetails): boolean {
        return this.track({ type: EventType.DocumentShare, occurred: new Date(), details });
    }

    trackNewPrompt(): boolean {
        return this.track({ type: EventType.NewPrompt, occurred: new Date() });
    }

    trackFollowUpPrompt(details: PromptMessageDetails): boolean {
        return this.track({ type: EventType.FollowUpPrompt, occurred: new Date(), details });
    }

    trackPageView(url: string): void {
        plausibleTrackPageview({ url });
    }

    trackParametersUpdate(details: { parameterUpdated: string }): boolean {
        return this.track({
            type: EventType.ParametersUpdate,
            occurred: new Date(),
            details,
        });
    }

    trackModelUpdate(details: { modelChosen: string }): boolean {
        return this.track({
            type: EventType.ModelUpdate,
            occurred: new Date(),
            details,
        });
    }

    trackExternalNavigationLinkClick(details: { url: string }): boolean {
        return this.track({
            type: EventType.ExternalNavigationLinkClick,
            occurred: new Date(),
            details,
        });
    }

    trackTermsLogOut(): boolean {
        return this.track({
            type: EventType.TermsLogOut,
            occurred: new Date(),
        });
    }

    trackColorModeChange(details: { colorMode: string }): boolean {
        return this.track({
            type: EventType.ColorModeChange,
            occurred: new Date(),
            details,
        });
    }

    trackModelOverloadedError(modelId: string): boolean {
        return this.track({
            type: EventType.ModelOverloadedError,
            occurred: new Date(),
            details: { modelId },
        });
    }

    trackQueryFormSubmission(modelId: string, isNewThread: boolean) {
        window.heap?.track(EventType.QueryFormSubmit, {
            model: modelId,
            isNewThread,
        });

        return this.track({
            type: EventType.QueryFormSubmit,
            occurred: new Date(),
            details: {
                model: modelId,
                isNewThread,
            },
        });
    }

    trackInappropriatePrompt() {
        window.heap?.track(EventType.PromptErrorInappropriate);

        return this.track({
            type: EventType.PromptErrorInappropriate,
            occurred: new Date(),
        });
    }

    trackPromptOlmoTrace(modelId: string, isEnabling: boolean) {
        window.heap?.track(EventType.PromptOlmoTrace, {
            model: modelId,
            isEnabling,
        });

        return this.track({
            type: EventType.PromptOlmoTrace,
            occurred: new Date(),
            details: {
                model: modelId,
                isEnabling,
            },
        });
    }

    trackCaptchaError(errorTypes: string[]) {
        window.heap?.track(EventType.CaptchaError);

        return this.track({
            type: EventType.CaptchaError,
            occurred: new Date(),
            details: {
                types: errorTypes,
            },
        });
    }
}

export const analyticsClient = new AnalyticsClient();
