import React from 'react';

type Props = React.PropsWithChildren<{}>;

type RepromptContext = {
    repromptText: string;
    setRepromptText: (text: string) => void;
};

const DEFAULT_CONTEXT: RepromptContext = {
    repromptText: '',
    setRepromptText: () => {},
};

function useRepromptActionContextProps(): RepromptContext {
    const [repromptText, setRepromptText] = React.useState('');
    return {
        repromptText,
        setRepromptText,
    };
}

export const RepromptActionContext = React.createContext(DEFAULT_CONTEXT);

export function RepromptActionContextProvider({ children }: Props): JSX.Element {
    const repromptActionContextProps = useRepromptActionContextProps();
    return (
        <RepromptActionContext.Provider value={repromptActionContextProps}>
            {children}
        </RepromptActionContext.Provider>
    );
}
