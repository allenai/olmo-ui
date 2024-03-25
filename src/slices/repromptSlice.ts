import { StateCreator } from 'zustand';

export interface RepromptSlice {
    repromptText: string;
    setRepromptText: (text: string) => void;
}

export const createRepromptSlice: StateCreator<RepromptSlice> = (set) => ({
    repromptText: '',
    setRepromptText: (text) => set({ repromptText: text }),
});
