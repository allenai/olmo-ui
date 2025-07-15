import { OlmoStateCreator } from '@/AppContext';

export interface GlobalThreadsUISlice {
    isShareReady: boolean;
    setIsShareReady: (isShareReady: boolean) => void;
}

// This is for any thread-related, UI state that doesn't fit in QueryContext providers
export const createGlobalThreadsUISlice: OlmoStateCreator<GlobalThreadsUISlice> = (set) => ({
    isShareReady: false,
    setIsShareReady: (isShareReady: boolean) => {
        set(
            (state) => {
                state.isShareReady = isShareReady;
            },
            undefined,
            'globalThreadsUI/setIsShareReady'
        );
    },
});
