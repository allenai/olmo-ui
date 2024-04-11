import { produce } from 'immer';

import {
    DefaultPromptTemplate,
    PromptTemplate,
    PromptTemplateList,
    PromptTemplatePatch,
    PromptTemplatePost,
} from '../api/PromptTemplate';

import { OlmoStateCreator } from '@/AppContext';
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

export const createPromptTemplateSlice: OlmoStateCreator<PromptTemplateSlice> = (set, get) => ({
    promptTemplateList: [DefaultPromptTemplate],
    promptTemplateRemoteState: undefined,
    promptTemplateListRemoteState: undefined,
    setPromptTemplateList: (list: PromptTemplateList) => set({ promptTemplateList: list }),
    getPromptTemplateList: async (includeDeleted?: boolean): Promise<PromptTemplateList> => {
        set({ promptTemplateListRemoteState: RemoteState.Loading });
        return promptTemplateClient
            .getPromptTemplateList(includeDeleted)
            .then((promptTemplates) => {
                const sortedPromptTemplates = [DefaultPromptTemplate]
                    .concat(promptTemplates)
                    .sort((a, b) => a.name.localeCompare(b.name));
                set({ promptTemplateList: sortedPromptTemplates });
                set({ promptTemplateListRemoteState: RemoteState.Loaded });

                return sortedPromptTemplates;
            })
            .catch((error) => {
                set({ promptTemplateListRemoteState: RemoteState.Error });
                return error;
            });
    },
    getPromptTemplate: async (id: string): Promise<PromptTemplate> => {
        set({ promptTemplateRemoteState: RemoteState.Loading });
        return promptTemplateClient
            .getPromptTemplate(id)
            .then((result) => {
                const updated = produce(get().promptTemplateList, (draft) => {
                    const index = draft.findIndex((dc) => dc.id === id);
                    if (index !== -1) {
                        draft[index] = result;
                    }
                });
                set({ promptTemplateList: updated });
                set({ promptTemplateRemoteState: RemoteState.Loaded });
                return result;
            })
            .catch((error) => {
                set({ promptTemplateRemoteState: RemoteState.Error });
                return error;
            });
    },
    createPromptTemplate: async (
        promptTemplateData: PromptTemplatePost
    ): Promise<PromptTemplate> => {
        set({ promptTemplateRemoteState: RemoteState.Loading });
        return promptTemplateClient
            .createPromptTemplate(promptTemplateData)
            .then((result) => {
                const updated = produce(get().promptTemplateList, (draft) => {
                    draft.unshift(result);
                });
                set({ promptTemplateList: updated });
                set({ promptTemplateRemoteState: RemoteState.Loaded });
                return result;
            })
            .catch((error) => {
                set({ promptTemplateRemoteState: RemoteState.Error });
                return error;
            });
    },
    patchPromptTemplate: async (
        id: string,
        patchValues: PromptTemplatePatch
    ): Promise<PromptTemplate> => {
        set({ promptTemplateRemoteState: RemoteState.Loading });
        return promptTemplateClient
            .patchPromptTemplate(id, patchValues)
            .then((result) => {
                const updated = produce(get().promptTemplateList, (draft) => {
                    const index = draft.findIndex((dc) => dc.id === id);
                    if (index !== -1) {
                        draft[index] = result;
                    }
                });
                set({ promptTemplateList: updated });
                set({ promptTemplateRemoteState: RemoteState.Loaded });
                return result;
            })
            .catch((error) => {
                set({ promptTemplateRemoteState: RemoteState.Error });
                return error;
            });
    },
});
