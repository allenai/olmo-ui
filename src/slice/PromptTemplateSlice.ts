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

export interface PromptTemplateSlice {
    promptTemplateRemoteState?: RemoteState;
    promptTemplateListRemoteState?: RemoteState;
    promptTemplateList: PromptTemplateList;
    getPromptTemplateList: (includeDeleted?: boolean) => Promise<PromptTemplateList>;
    getPromptTemplate(id: string): Promise<PromptTemplate>;
    createPromptTemplate(promptTemplateData: PromptTemplatePost): Promise<PromptTemplate>;
    patchPromptTemplate(id: string, patchValues: PromptTemplatePatch): Promise<PromptTemplate>;
}

const promptTemplateClient = new PromptTemplateClient();

export const createPromptTemplateSlice: StateCreator<PromptTemplateSlice> = (set, get) => ({
    promptTemplateList: [],
    promptTemplateRemoteState: undefined,
    promptTemplateListRemoteState: undefined,
    setPromptTemplateList: (list: PromptTemplateList) => set({ promptTemplateList: list }),
    getPromptTemplateList: async (includeDeleted?: boolean): Promise<PromptTemplateList> => {
        set({ promptTemplateListRemoteState: RemoteState.Loading });
        return promptTemplateClient
            .getPromptTemplateList(includeDeleted)
            .then((r) => {
                set({ promptTemplateList: r });
                set({ promptTemplateListRemoteState: RemoteState.Loaded });
                return r;
            })
            .catch((e) => {
                set({ promptTemplateListRemoteState: RemoteState.Error });
                return e;
            });
    },
    getPromptTemplate: async (id: string): Promise<PromptTemplate> => {
        set({ promptTemplateRemoteState: RemoteState.Loading });
        return promptTemplateClient
            .getPromptTemplate(id)
            .then((r) => {
                const updated = produce(get().promptTemplateList, (draft) => {
                    const index = draft.findIndex((dc) => dc.id === id);
                    if (index !== -1) {
                        draft[index] = r;
                    }
                });
                set({ promptTemplateList: updated });
                set({ promptTemplateRemoteState: RemoteState.Loaded });
                return r;
            })
            .catch((e) => {
                set({ promptTemplateRemoteState: RemoteState.Error });
                return e;
            });
    },
    createPromptTemplate: async (
        promptTemplateData: PromptTemplatePost
    ): Promise<PromptTemplate> => {
        set({ promptTemplateRemoteState: RemoteState.Loading });
        return promptTemplateClient
            .createPromptTemplate(promptTemplateData)
            .then((r) => {
                const updated = produce(get().promptTemplateList, (draft) => {
                    draft.unshift(r);
                });
                set({ promptTemplateList: updated });
                set({ promptTemplateRemoteState: RemoteState.Loaded });
                return r;
            })
            .catch((e) => {
                set({ promptTemplateRemoteState: RemoteState.Error });
                return e;
            });
    },
    patchPromptTemplate: async (
        id: string,
        patchValues: PromptTemplatePatch
    ): Promise<PromptTemplate> => {
        set({ promptTemplateRemoteState: RemoteState.Loading });
        return promptTemplateClient
            .patchPromptTemplate(id, patchValues)
            .then((r) => {
                const updated = produce(get().promptTemplateList, (draft) => {
                    const index = draft.findIndex((dc) => dc.id === id);
                    if (index !== -1) {
                        draft[index] = r;
                    }
                });
                set({ promptTemplateList: updated });
                set({ promptTemplateRemoteState: RemoteState.Loaded });
                return r;
            })
            .catch((e) => {
                set({ promptTemplateRemoteState: RemoteState.Error });
                return e;
            });
    },
});
