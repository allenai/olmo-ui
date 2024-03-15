import { create } from 'zustand';

interface RepromptState {
    repromptText: string;
    setRepromptText: (text: string) => void;
}

const useRepromptStore = create<RepromptState>((set) => ({
    repromptText: '',
    setRepromptText: (text) => set({ repromptText: text }),
}));

export default useRepromptStore;
