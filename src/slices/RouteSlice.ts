import { OlmoStateCreator } from '@/AppContext';

export interface RouteSlice {
    currentRoute: string;
    setCurrentRoute: (route: string) => void;
}

export const createRouteSlice: OlmoStateCreator<RouteSlice> = (set) => ({
    currentRoute: '',
    setCurrentRoute: (route) => {
        set({ currentRoute: route });
    },
});
