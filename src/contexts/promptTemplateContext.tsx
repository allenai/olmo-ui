// context exposing client actions on PromptTemplates

import React, { ReactNode, createContext, useState } from 'react';
import { produce } from 'immer';

import { PromptTemplateClient } from '../api/PromptTemplateClient';
import {
    PromptTemplate,
    PromptTemplateList,
    PromptTemplatePatch,
    PromptTemplatePost,
} from '../api/PromptTemplate';
import { RemoteState, ensureContext } from './util';

interface PromptTemplateContextProps {
    remoteState?: RemoteState;
    promptTemplateList: PromptTemplateList;
    getPromptTemplateList: (includeDeleted?: boolean) => Promise<PromptTemplateList>;
    getPromptTemplate(id: string): Promise<PromptTemplate>;
    createPromptTemplate(promptTemplateData: PromptTemplatePost): Promise<PromptTemplate>;
    patchPromptTemplate(id: string, patchValues: PromptTemplatePatch): Promise<PromptTemplate>;
}

const PromptTemplateContext = createContext<PromptTemplateContextProps | undefined>(undefined);

export const usePromptTemplate = () => ensureContext(PromptTemplateContext, 'PromptTemplates');

export const PromptTemplateProvider = ({ children }: { children: ReactNode }) => {
    const promptTemplateClient = new PromptTemplateClient();

    const [remoteState, setRemoteState] = useState<RemoteState>();
    const [promptTemplateList, setPromptTemplateList] = useState<PromptTemplateList>([]);

    const getPromptTemplateList = async (includeDeleted?: boolean): Promise<PromptTemplateList> => {
        setRemoteState(RemoteState.Loading);
        return promptTemplateClient
            .getPromptTemplateList(includeDeleted)
            .then((r) => {
                setPromptTemplateList(r);
                setRemoteState(RemoteState.Loaded);
                return r;
            })
            .catch((e) => {
                setRemoteState(RemoteState.Error);
                return e;
            });
    };

    const getPromptTemplate = async (id: string): Promise<PromptTemplate> => {
        setRemoteState(RemoteState.Loading);
        return promptTemplateClient
            .getPromptTemplate(id)
            .then((r) => {
                const updated = produce(promptTemplateList, (draft) => {
                    const index = draft.findIndex((dc) => dc.id === id);
                    if (index !== -1) {
                        draft[index] = r;
                    }
                });
                setPromptTemplateList(updated);
                setRemoteState(RemoteState.Loaded);
                return r;
            })
            .catch((e) => {
                setRemoteState(RemoteState.Error);
                return e;
            });
    };

    const createPromptTemplate = async (
        promptTemplateData: PromptTemplatePost
    ): Promise<PromptTemplate> => {
        setRemoteState(RemoteState.Loading);
        return promptTemplateClient
            .createPromptTemplate(promptTemplateData)
            .then((r) => {
                const updated = produce(promptTemplateList, (draft) => {
                    draft.unshift(r);
                });
                setPromptTemplateList(updated);
                setRemoteState(RemoteState.Loaded);
                return r;
            })
            .catch((e) => {
                setRemoteState(RemoteState.Error);
                return e;
            });
    };

    const patchPromptTemplate = async (
        id: string,
        patchValues: PromptTemplatePatch
    ): Promise<PromptTemplate> => {
        setRemoteState(RemoteState.Loading);
        return promptTemplateClient
            .patchPromptTemplate(id, patchValues)
            .then((r) => {
                const updated = produce(promptTemplateList, (draft) => {
                    const index = draft.findIndex((dc) => dc.id === id);
                    if (index !== -1) {
                        draft[index] = r;
                    }
                });
                setPromptTemplateList(updated);
                setRemoteState(RemoteState.Loaded);
                return r;
            })
            .catch((e) => {
                setRemoteState(RemoteState.Error);
                return e;
            });
    };

    return (
        <PromptTemplateContext.Provider
            value={{
                remoteState,
                promptTemplateList,
                getPromptTemplateList,
                getPromptTemplate,
                createPromptTemplate,
                patchPromptTemplate,
            }}>
            {children}
        </PromptTemplateContext.Provider>
    );
};
