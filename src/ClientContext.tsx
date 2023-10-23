import React, { createContext, useContext, ReactNode } from 'react';

import { DataChipClient } from './api/DataChipClient';
import { DolmaClient } from './api/DolmaClient';

interface ClientContextProps {
    dolmaClient: DolmaClient;
    dataChipClient: DataChipClient;
}

const ClientContext = createContext<ClientContextProps | undefined>(undefined);

export const useClient = (): ClientContextProps => {
    const context = useContext(ClientContext);
    if (!context) {
        throw new Error('useClient must be used within a ClientProvider');
    }
    return context;
};

interface ClientProviderProps {
    children: ReactNode;
}

export const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
    const dolmaClient = new DolmaClient();
    const dataChipClient = new DataChipClient();

    return (
        <ClientContext.Provider value={{ dolmaClient, dataChipClient }}>
            {children}
        </ClientContext.Provider>
    );
};
