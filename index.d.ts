declare module '*.svg' {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content: any;
    export default content;
}

interface Window {
    // taken from https://developers.heap.io/reference/client-side-apis-overview#typescript-type-definitions
    heap?: {
        track: (event: string, properties?: object) => void;
        identify: (identity: string) => void;
        resetIdentity: () => void;
        addUserProperties: (properties: object) => void;
        addEventProperties: (properties: object) => void;
        removeEventProperty: (property: string) => void;
        clearEventProperties: () => void;
        appid: string;
        userId: string;
        identity: string | null;
        config: unknown;
    };

    Osano?: {
        cm?: {
            analytics: boolean;
            cmpVersion: string;
            drawerOpen: boolean;
            dialogOpen: boolean;
            jurisdiction: string;
            locale: string;
            marketing: boolean;
            mode: string;
            optOut: boolean;
            personalization: boolean;
            userData: string;

            addEventListener: (eventName: string, callback: (...args: unknown[]) => void) => void;
        };
        (): (eventName: string, callback: (...args: unknown[]) => void) => void;
    };
}
