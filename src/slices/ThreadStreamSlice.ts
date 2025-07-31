import { OlmoStateCreator } from 'src/AppContext';

export interface ThreadStreamSlice {
    activeThreadViewIds: string[];
    streamErrors: Record<string, unknown>;

    addActiveStream: (threadViewId: string) => void;
    removeActiveStream: (threadViewId: string) => void;
    setStreamError: (threadViewId: string, error: unknown) => void;
    clearStreamError: (threadViewId: string) => void;
    clearAllActiveStreams: () => void;
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
            state.activeThreadViewIds = [];
        });
    },
});
