import { search } from '../api/dolma/search';
import { plausibleTrackEvent, plausibleTrackPageview } from './plausible';

export enum EventType {
    SearchQuery = 'search.query',
    SearchResultClick = 'search.result.click',
    DocumentView = 'document.view',
    DocumentShare = 'document.share',
    NewPrompt = 'prompt.new',
    FollowUpPrompt = 'prompt.followup',
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
        | PromptMessageDetails;
}

export class AnalyticsClient {
    private get hasConsentToTrack(): boolean {
        return window.Osano?.cm?.analytics === true;
    }

    /**
     * Enqueues an event to be tracked and returns true upon it being enqueued.
     * This does not block for the request to be sent (or for a response to be received).
     * Rather it enqueues the request for eventual, background delivery by the browser.
     * See https://developer.mozilla.org/en-US/docs/Web/API/Beacon_API
     */
    private track(e: AnalyticsEvent): boolean {
        if (this.hasConsentToTrack) {
            plausibleTrackEvent(e);

            const data = new Blob([JSON.stringify(e)], { type: 'application/json' });
            return navigator.sendBeacon('/api/v1/event', data);
        } else {
            return false;
        }
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
        if (this.hasConsentToTrack) {
            plausibleTrackPageview({ url });
        }
    }
}

export const analyticsClient = new AnalyticsClient();
