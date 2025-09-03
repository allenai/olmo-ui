import {
    createContext,
    FC,
    PropsWithChildren,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

export enum FeatureToggle {
    logToggles = 'logToggles',
    isCorpusLinkEnabled = 'isCorpusLinkEnabled',
    absoluteSpanScore = 'absoluteSpanScore',
    bucketColors = 'bucketColors',
    isDatasetExplorerEnabled = 'isDatasetExplorerEnabled',
    isPeteishModelEnabled = 'isPeteishModelEnabled',
    isMultiModalEnabled = 'isMultiModalEnabled',
    isModelConfigEnabled = 'isModelConfigEnabled',
    isOLMoASREnabled = 'isOLMoASREnabled',
}

export type FeatureToggles = Record<FeatureToggle, boolean>;

export const defaultFeatureToggles: FeatureToggles = {
    [FeatureToggle.logToggles]: true,
    [FeatureToggle.isCorpusLinkEnabled]: false,
    [FeatureToggle.absoluteSpanScore]: true,
    [FeatureToggle.bucketColors]: true,
    [FeatureToggle.isDatasetExplorerEnabled]: false,
    [FeatureToggle.isPeteishModelEnabled]: false,
    [FeatureToggle.isMultiModalEnabled]: false,
    [FeatureToggle.isModelConfigEnabled]: false,
    [FeatureToggle.isOLMoASREnabled]: false,
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

const parseToggles = (toggles: Partial<Record<FeatureToggle, FTValue>>): FeatureToggles => {
    const ret: FeatureToggles = {} as FeatureToggles;
    Object.entries(toggles).forEach(([key, value]) => {
        if (key in FeatureToggle) {
            const kk: FeatureToggle = FeatureToggle[key as keyof typeof FeatureToggle];
            ret[kk] = parseToggleValue(value);
        }
    });
    return ret;
};

export interface FeatureToggleProps extends PropsWithChildren {
    featureToggles?: FeatureToggles;
}

export const FeatureToggleContext = createContext<FeatureToggles>(defaultFeatureToggles);

function createToggles(initialToggles = defaultFeatureToggles) {
    // grab from local storage if we have any
    const localStorageToggles = parseToggles(
        JSON.parse(localStorage.getItem(localStorageKey) || '{}') as Record<string, FTValue>
    );

    // grab from url if we have any
    const query = new URL(window.location.href).searchParams;
    const queryToggles = parseToggles(Object.fromEntries(query));

    const envToggles = parseToggles({
        isCorpusLinkEnabled: process.env.VITE_IS_CORPUS_LINK_ENABLED,
        absoluteSpanScore: process.env.VITE_ABSOLUTE_SPAN_SCORE,
        bucketColors: process.env.VITE_BUCKET_COLORS,
        isDatasetExplorerEnabled: process.env.VITE_IS_DATASET_EXPLORER_ENABLED,
        isMultiModalEnabled: process.env.VITE_IS_MULTI_MODAL_ENABLED,
        isModelConfigEnabled: process.env.VITE_IS_MODEL_CONFIG_ENABLED,
        isOLMoASREnabled: process.env.VITE_IS_OLMO_ASR_ENABLED,
    });

    const toggles = {
        ...initialToggles,
        ...localStorageToggles,
        ...envToggles,
        ...queryToggles,
    };

    return toggles;
}

export const FeatureToggleProvider: FC<FeatureToggleProps> = ({
    children,
    featureToggles: initialToggles = defaultFeatureToggles,
}) => {
    const [featureToggles, setFeatureToggles] = useState(initialToggles);

    const hasTogglesInitializationRun = useRef(false);

    useEffect(() => {
        if (hasTogglesInitializationRun.current) {
            return;
        }

        const toggles = createToggles(initialToggles);

        // save back to local storage
        localStorage.setItem(localStorageKey, JSON.stringify(toggles));

        setFeatureToggles(toggles);

        if (toggles.logToggles) {
            console.table(toggles);
        }

        hasTogglesInitializationRun.current = true;
    }, [initialToggles, hasTogglesInitializationRun]);

    return (
        <FeatureToggleContext.Provider value={featureToggles}>
            {children}
        </FeatureToggleContext.Provider>
    );
};

export function useFeatureToggles() {
    return useContext(FeatureToggleContext);
}

export function getFeatureToggles() {
    return createToggles();
}
