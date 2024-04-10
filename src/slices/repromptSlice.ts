import { OlmoStateCreator } from '@/AppContext';

export interface RepromptSlice {
    repromptText: string;
    setRepromptText: (text: string) => void;
}

export const createRepromptSlice: OlmoStateCreator<RepromptSlice> = (set) => ({
    repromptText: '',
    setRepromptText: (text) => set({ repromptText: text }),
});
