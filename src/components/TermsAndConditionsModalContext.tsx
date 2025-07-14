import React, { createContext, useCallback, useContext, useState } from 'react';

import { OptionValues, SectionTitle } from './TermsAndConditionsModal';

export interface FormValues {
    acknowledgements: boolean[];
    optionGroups: {
        selectedOption: OptionValues;
    }[];
}

interface TermsAndConditionsContextValue {
    step: number;
    setStep: (s: number) => void;
    responses: Record<SectionTitle, FormValues>;
    updateStepData: (stepTitle: SectionTitle, data: FormValues) => void;
    reset: () => void;
}

const Context = createContext<TermsAndConditionsContextValue | undefined>(undefined);

export const useTermsAndConditionsContext = () => {
    const ctx = useContext(Context);
    if (!ctx) {
        throw new Error(
            'useTermsAndConditionsContext must be used within TermsAndConditionsProvider'
        );
    }
    return ctx;
};

export const TermsAndConditionsProvider = ({ children }: { children: React.ReactNode }) => {
    const [step, setStep] = useState(0);
    const [responses, setResponses] = useState<Record<SectionTitle, FormValues>>(
        {} as Record<SectionTitle, FormValues>
    );

    const updateStepData = useCallback((stepTitle: SectionTitle, data: FormValues) => {
        setResponses((prev) => ({ ...prev, [stepTitle]: data }));
    }, []);

    const reset = useCallback(() => {
        setStep(0);
        setResponses({} as Record<SectionTitle, FormValues>);
    }, []);

    return (
        <Context.Provider value={{ step, setStep, responses, updateStepData, reset }}>
            {children}
        </Context.Provider>
    );
};
