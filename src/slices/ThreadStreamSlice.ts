import { OlmoStateCreator } from 'src/AppContext';

export interface ThreadStreamSlice {
    activeThreadViewIds: string[];
    streamErrors: Record<string, unknown>;

    addActiveStream: (threadViewId: string) => void;
    removeActiveStream: (threadViewId: string) => void;
    setStreamError: (threadViewId: string, error: unknown) => void;
    clearStreamError: (threadViewId: string) => void;
    clearAllActiveStreams: () => void;
    clearAllStreamErrors: () => void;
}

export const createThreadStreamSlice: OlmoStateCreator<ThreadStreamSlice> = (set) => ({
    activeThreadViewIds: [],
    streamErrors: {},

    addActiveStream: (threadViewId: string) => {
        set((state: ThreadStreamSlice) => {
            if (!state.activeThreadViewIds.includes(threadViewId)) {
                state.activeThreadViewIds.push(threadViewId);
            }
        });
    },

    removeActiveStream: (threadViewId: string) => {
        set((state: ThreadStreamSlice) => {
            const index = state.activeThreadViewIds.indexOf(threadViewId);
            if (index > -1) {
                state.activeThreadViewIds.splice(index, 1);
            }
        });
    },

    setStreamError: (threadViewId: string, error: unknown) => {
        set((state: ThreadStreamSlice) => {
            state.streamErrors[threadViewId] = error;
        });
    },

    clearStreamError: (threadViewId: string) => {
        set((state: ThreadStreamSlice) => {
            state.streamErrors[threadViewId] = undefined;
        });
    },

    clearAllActiveStreams: () => {
        set((state: ThreadStreamSlice) => {
            // This check is here because this could get called in a loop and cause infinite re-renders
            // We're setting memoization on other parts of the app but this is the real fix
            // Do not change this unless you're very certain of what you're doing!
            if (state.activeThreadViewIds.length > 0) {
                state.activeThreadViewIds = [];
            }
        });
    },

    clearAllStreamErrors: () => {
        set((state: ThreadStreamSlice) => {
            if (Object.keys(state.streamErrors).length > 0) {
                state.streamErrors = {};
            }
        });
    },
});
