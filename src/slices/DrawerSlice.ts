import { OlmoStateCreator } from '@/AppContext';

export type DrawerId = 'history' | 'parameters' | 'category' | 'attribution';
export type ThreadTabId = 'parameters' | 'attribution';

export interface DrawerSlice {
    currentOpenDrawer: DrawerId | null;
    currentOpenThreadTab: ThreadTabId;
    openDrawer: (id: DrawerId) => void;
    closeDrawer: (id: DrawerId) => void;
    toggleDrawer: (id: DrawerId) => void;
}

export const createDrawerSlice: OlmoStateCreator<DrawerSlice> = (set, get) => ({
    currentOpenDrawer: null,
    currentOpenThreadTab: 'parameters',

    openDrawer: (id) => {
        set(
            (state) => {
                state.currentOpenDrawer = id;

                if (['parameters', 'attribution'].includes(id)) {
                    // This is a safe assertion because we check to see if it's a ThreadTabId in the if
                    state.currentOpenThreadTab = id as ThreadTabId;
                }
            },
            false,
            'drawer/openDrawer'
        );
    },

    closeDrawer: (id) => {
        const { currentOpenDrawer } = get();

        if (currentOpenDrawer === id) {
            set({ currentOpenDrawer: null }, false, 'drawer/closeDrawer');
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
