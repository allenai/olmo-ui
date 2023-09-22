import React, { createContext, useState, useEffect } from 'react';

type FeatureToggles = Record<FeatureToggle, boolean>;

export enum FeatureToggle {
    logToggles = 'logToggles',
    contextMenuFixed = 'contextMenuFixed',
    chips = 'chips',
}

const defaultFeatureToggles: FeatureToggles = {
    [FeatureToggle.logToggles]: true,
    [FeatureToggle.contextMenuFixed]: false,
    [FeatureToggle.chips]: false,
};

const localStorageKey = 'feature-toggles';

type FTValue = string | boolean | number;

// allows easier use of toggles
const parseToggleValue = (toggleValue: FTValue): boolean => {
    switch (toggleValue.toString().toLowerCase()) {
        case 'true':
        case '1':
        case 'on':
        case 'yes':
            return true;
        case 'false':
        case '0':
        case 'off':
        case 'no':
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

        const toggles = {
            ...initialToggles,
            ...localStorageToggles,
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
