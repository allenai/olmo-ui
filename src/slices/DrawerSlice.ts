import { OlmoStateCreator } from '@/AppContext';

export type DrawerId = 'history' | 'parameters' | 'category' | 'attribution';

export interface DrawerSlice {
    currentOpenDrawer: DrawerId | null;
    openDrawer: (id: DrawerId) => void;
    closeDrawer: (id: DrawerId) => void;
    toggleDrawer: (id: DrawerId) => void;
}

export const createDrawerSlice: OlmoStateCreator<DrawerSlice> = (set, get) => ({
    currentOpenDrawer: null,

    openDrawer: (id) => {
        set({ currentOpenDrawer: id });
    },

    closeDrawer: (id) => {
        const { currentOpenDrawer } = get();

        if (currentOpenDrawer === id) {
            set({ currentOpenDrawer: null });
        }
    },

    toggleDrawer: (id) => {
        const { currentOpenDrawer, closeDrawer, openDrawer } = get();

        if (currentOpenDrawer === id) {
            closeDrawer(id);
        } else {
            openDrawer(id);
        }
    },
});
