import React, { createContext, useContext, ReactNode } from 'react';

import { PromptTemplateClient } from './api/PromptTemplateClient';

// todo: this fill we be deleted soon
interface ClientContextProps {
    promptTemplateClient: PromptTemplateClient;
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
    const promptTemplateClient = new PromptTemplateClient();

    return (
        <ClientContext.Provider value={{ promptTemplateClient }}>{children}</ClientContext.Provider>
    );
};
