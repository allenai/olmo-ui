import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from 'react';

export enum FeatureToggle {
    logToggles = 'logToggles',
    attribution = 'attribution',
    attributionSpanFirst = 'attributionSpanFirst',
}

export type FeatureToggles = Record<FeatureToggle, boolean>;

export const defaultFeatureToggles: FeatureToggles = {
    [FeatureToggle.logToggles]: true,
    [FeatureToggle.attribution]: false,
    [FeatureToggle.attributionSpanFirst]: false,
};

const localStorageKey = 'feature-toggles';

type FTValue = string | boolean | number | undefined;

// allows easier use of toggles
const parseToggleValue = (toggleValue: FTValue): boolean => {
    switch (toggleValue?.toString().toLowerCase()) {
        case 'true':
        case '1':
        case 'on':
        case 'yes':
            return true;
        case 'false':
        case '0':
        case 'off':
        case 'no':
        case undefined:
        case null:
        default:
            return false;
    }
};

const parseToggles = (toggles: Record<string, FTValue>): FeatureToggles => {
    const ret: FeatureToggles = {} as FeatureToggles;
    Object.entries(toggles).forEach(([k, v]) => {
        if (k in FeatureToggle) {
            const kk: FeatureToggle = FeatureToggle[k as keyof typeof FeatureToggle];
            ret[kk] = parseToggleValue(v);
        }
    });
    return ret;
};

export interface FeatureToggleProps extends PropsWithChildren {
    featureToggles?: FeatureToggles;
}

export const FeatureToggleContext = createContext<FeatureToggles>(defaultFeatureToggles);

export const FeatureToggleProvider: FC<FeatureToggleProps> = ({
    children,
    featureToggles: initialToggles = defaultFeatureToggles,
}) => {
    const [featureToggles, setFeatureToggles] = useState(initialToggles);

    useEffect(() => {
        // grab from local storage if we have any
        const localStorageToggles = parseToggles(
            JSON.parse(localStorage.getItem(localStorageKey) || '{}') as Record<string, FTValue>
        );

        // grab from url if we have any
        const query = new URL(window.location.href).searchParams;
        const queryToggles = parseToggles(Object.fromEntries(query));

        const envToggles = parseToggles({
            attribution: process.env.IS_ATTRIBUTION_ENABLED,
            attributionSpanFirst: process.env.IS_ATTRIBUTION_SPAN_FIRST_ENABLED,
        });

        const toggles = {
            ...initialToggles,
            ...localStorageToggles,
            ...envToggles,
            ...queryToggles,
        };

        // save back to local storage
        localStorage.setItem(localStorageKey, JSON.stringify(toggles));

        setFeatureToggles(toggles);

        if (toggles.logToggles) {
            console.table(toggles);
        }
    }, []);

    return (
        <FeatureToggleContext.Provider value={featureToggles}>
            {children}
        </FeatureToggleContext.Provider>
    );
};

export function useFeatureToggles() {
    return useContext(FeatureToggleContext);
}
