import { produce } from 'immer';
import {
    PromptTemplate,
    PromptTemplateList,
    PromptTemplatePatch,
    PromptTemplatePost,
} from 'src/api/PromptTemplate';

import { StateCreator } from 'zustand';

import { PromptTemplateClient } from '../api/PromptTemplateClient';
import { RemoteState } from '../contexts/util';

export interface PromptTemplateState {
    remoteState?: RemoteState;
    promptTemplateList: PromptTemplateList;
    setRemoteState: (state: RemoteState) => void;
    setPromptTemplateList: (list: PromptTemplateList) => void;
    getPromptTemplateList: (includeDeleted?: boolean) => Promise<PromptTemplateList>;
    getPromptTemplate(id: string): Promise<PromptTemplate>;
    createPromptTemplate(promptTemplateData: PromptTemplatePost): Promise<PromptTemplate>;
    patchPromptTemplate(id: string, patchValues: PromptTemplatePatch): Promise<PromptTemplate>;
}

const promptTemplateClient = new PromptTemplateClient();

export const createPromptTemplateSlice: StateCreator<PromptTemplateState> = (set, get) => ({
    promptTemplateList: [],
    remoteState: undefined,
    setPromptTemplateList: (list: PromptTemplateList) => set({ promptTemplateList: list }),
    setRemoteState: (state: RemoteState) => set({ remoteState: state }),
    getPromptTemplateList: async (includeDeleted?: boolean): Promise<PromptTemplateList> => {
        get().setRemoteState(RemoteState.Loading);
        return promptTemplateClient
            .getPromptTemplateList(includeDeleted)
            .then((r) => {
                get().setPromptTemplateList(r);
                get().setRemoteState(RemoteState.Loaded);
                return r;
            })
            .catch((e) => {
                get().setRemoteState(RemoteState.Error);
                return e;
            });
    },
    getPromptTemplate: async (id: string): Promise<PromptTemplate> => {
        get().setRemoteState(RemoteState.Loading);
        return promptTemplateClient
            .getPromptTemplate(id)
            .then((r) => {
                const updated = produce(get().promptTemplateList, (draft) => {
                    const index = draft.findIndex((dc) => dc.id === id);
                    if (index !== -1) {
                        draft[index] = r;
                    }
                });
                get().setPromptTemplateList(updated);
                get().setRemoteState(RemoteState.Loaded);
                return r;
            })
            .catch((e) => {
                get().setRemoteState(RemoteState.Error);
                return e;
            });
    },
    createPromptTemplate: async (
        promptTemplateData: PromptTemplatePost
    ): Promise<PromptTemplate> => {
        get().setRemoteState(RemoteState.Loading);
        return promptTemplateClient
            .createPromptTemplate(promptTemplateData)
            .then((r) => {
                const updated = produce(get().promptTemplateList, (draft) => {
                    draft.unshift(r);
                });
                get().setPromptTemplateList(updated);
                get().setRemoteState(RemoteState.Loaded);
                return r;
            })
            .catch((e) => {
                get().setRemoteState(RemoteState.Error);
                return e;
            });
    },
    patchPromptTemplate: async (
        id: string,
        patchValues: PromptTemplatePatch
    ): Promise<PromptTemplate> => {
        get().setRemoteState(RemoteState.Loading);
        return promptTemplateClient
            .patchPromptTemplate(id, patchValues)
            .then((r) => {
                const updated = produce(get().promptTemplateList, (draft) => {
                    const index = draft.findIndex((dc) => dc.id === id);
                    if (index !== -1) {
                        draft[index] = r;
                    }
                });
                get().setPromptTemplateList(updated);
                get().setRemoteState(RemoteState.Loaded);
                return r;
            })
            .catch((e) => {
                get().setRemoteState(RemoteState.Error);
                return e;
            });
    },
});
