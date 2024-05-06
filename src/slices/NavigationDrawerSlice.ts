import { OlmoStateCreator } from '@/AppContext';

export interface NavigationDrawerSlice {
    isNavigationDrawerOpen: boolean;
    toggleIsNavigationDrawerOpen: () => void;
}

export const createNavigationDrawerSlice: OlmoStateCreator<NavigationDrawerSlice> = (set) => ({
    isNavigationDrawerOpen: false,

    toggleIsNavigationDrawerOpen: () => {
        set(
            (state) => {
                state.isNavigationDrawerOpen = !state.isNavigationDrawerOpen;
            },
            undefined,
            'navigationDrawer/toggleIsNavigationDrawerOpen'
        );
    },
});
