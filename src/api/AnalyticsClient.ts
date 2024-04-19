import { search } from './dolma/search';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace event {
    export enum Type {
        SearchQuery = 'search.query',
        SearchResultClick = 'search.result.click',
        DocumentView = 'document.view',
        DocumentShare = 'document.share',
        NewPrompt = 'prompt.new',
        FollowUpPrompt = 'prompt.followup',
    }

    export interface SearchQueryDetails {
        request: search.Request;
        response: { meta: search.Meta };
    }

    export interface SearchResultClickDetails {
        id: string;
        request: search.Request;
        source: search.Source;
        index: number;
    }

    export interface DocumentEventDetails {
        id: string;
        source: search.Source;
        query?: string;
    }

    export interface PromptMessageDetails {
        content: string;
        threadId?: string;
    }

    export interface Event {
        type: Type;
        occurred: Date;
        details?:
            | SearchQueryDetails
            | SearchResultClickDetails
            | DocumentEventDetails
            | PromptMessageDetails;
    }
}

export class AnalyticsClient {
    /**
     * Enqueues an event to be tracked and returns true upon it being enqueued.
     * This does not block for the request to be sent (or for a response to be received).
     * Rather it enqueues the request for eventual, background delivery by the browser.
     * See https://developer.mozilla.org/en-US/docs/Web/API/Beacon_API
     */
    private track(e: event.Event): boolean {
        const data = new Blob([JSON.stringify(e)], { type: 'application/json' });
        return navigator.sendBeacon('/api/v1/event', data);
    }

    trackSearchQuery(details: event.SearchQueryDetails): boolean {
        return this.track({ type: event.Type.SearchQuery, occurred: new Date(), details });
    }

    trackSearchResultClick(details: event.SearchResultClickDetails): boolean {
        return this.track({ type: event.Type.SearchResultClick, occurred: new Date(), details });
    }

    trackDocumentView(details: event.DocumentEventDetails): boolean {
        return this.track({ type: event.Type.DocumentView, occurred: new Date(), details });
    }

    trackDocumentShare(details: event.DocumentEventDetails): boolean {
        return this.track({ type: event.Type.DocumentShare, occurred: new Date(), details });
    }

    trackNewPrompt(details: event.PromptMessageDetails): boolean {
        return this.track({ type: event.Type.NewPrompt, occurred: new Date(), details });
    }

    trackFollowUpPrompt(details: event.PromptMessageDetails): boolean {
        return this.track({ type: event.Type.FollowUpPrompt, occurred: new Date(), details });
    }
}

export const analyticsClient = new AnalyticsClient();
