import { search } from './search';

export namespace event {
    export enum Type {
        SearchQuery = 'search.query',
        SearchResultClick = 'search.result.click',
        DocumentView = 'document.view',
        DocumentShare = 'document.share',
    }

    export interface Event {
        type: Type;
        occurred: Date;
        details?: SearchQueryDetails | SearchResultClickDetails | DocumentEventDetails;
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
}
