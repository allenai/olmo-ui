import { StateCreator } from 'zustand';

export interface RepromptState {
    repromptText: string;
    setRepromptText: (text: string) => void;
}

export const createRepromptSlice: StateCreator<RepromptState> = (set) => ({
    repromptText: '',
    setRepromptText: (text) => set({ repromptText: text }),
});
