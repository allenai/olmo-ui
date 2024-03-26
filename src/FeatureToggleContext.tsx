import { createContext, useState, useEffect } from 'react';
import * as React from 'react';

type FeatureToggles = Record<FeatureToggle, boolean>;

export enum FeatureToggle {
    logToggles = 'logToggles',
    isV0Enabled = 'isV0Enabled',
}

const defaultFeatureToggles: FeatureToggles = {
    [FeatureToggle.logToggles]: true,
    [FeatureToggle.isV0Enabled]: false,
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

export interface FeatureToggleProps extends React.PropsWithChildren {
    featureToggles?: FeatureToggles;
}

const Ctx = createContext<FeatureToggles>(defaultFeatureToggles);

export const FeatureToggleProvider: React.FC<FeatureToggleProps> = ({
    children,
    featureToggles: initialToggles = defaultFeatureToggles,
}) => {
    const [featureToggles, setFeatureToggles] = useState(initialToggles);

    useEffect(() => {
        // grab from local storage if we have any
        const localStorageToggles = parseToggles(
            JSON.parse(localStorage.getItem(localStorageKey) || '{}')
        );

        // grab from url if we have any
        const query = new URL(window.location.href).searchParams;
        const queryToggles = parseToggles(Object.fromEntries(new URLSearchParams(query)));

        const envToggles = parseToggles({ isV0Enabled: process.env.IS_V0_ENABLED });

        const toggles = {
            ...initialToggles,
            ...localStorageToggles,
            ...envToggles,
            ...queryToggles,
        };

        // save back to local storage
        localStorage.setItem(localStorageKey, JSON.stringify(toggles));

        setFeatureToggles(toggles);
    }, []);

    return <Ctx.Provider value={featureToggles}>{children}</Ctx.Provider>;
};

export function useFeatureToggles() {
    return React.useContext(Ctx);
}
