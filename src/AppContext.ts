import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { PromptTemplateSlice, createPromptTemplateSlice } from './slices/PromptTemplateSlice';
import { RepromptSlice, createRepromptSlice } from './slices/repromptSlice';
import { ThreadSlice, createThreadSlice } from './slices/ThreadSlice';
import { AlertMessageSlice, createAlertMessageSlice } from './slices/AlertMessageSlice';
import { LabelSlice, createLabelSlice } from './slices/LabelSlice';
import { UserSlice, createUserSlice } from './slices/UserSlice';
import { ModelSlice, createModelSlice } from './slices/ModelSlice';
import { SchemaSlice, createSchemaSlice } from './slices/SchemaSlice';
import { SearchSlice, createSearchSlice } from './slices/SearchSlice';
import { MetaSlice, createMetaSlice } from './slices/MetaSlice';
import { DrawerSlice, createDrawerSlice } from './slices/DrawerSlice';
import { DocumentSlice, createDocumentSlice } from './slices/DocumentSlice';

export type FetchInfo<T> = {
    data?: T;
    loading?: boolean;
    error?: boolean;
};

type AppContextState = LabelSlice &
    PromptTemplateSlice &
    RepromptSlice &
    ThreadSlice &
    AlertMessageSlice &
    UserSlice &
    ModelSlice &
    SchemaSlice &
    SearchSlice &
    MetaSlice &
    DrawerSlice &
    DocumentSlice;

export const useAppContext = create<AppContextState>()(
    devtools((set, get, store) => ({
        ...createRepromptSlice(set, get, store),
        ...createPromptTemplateSlice(set, get, store),
        ...createAlertMessageSlice(set, get, store),
        ...createThreadSlice(set, get, store),
        ...createLabelSlice(set, get, store),
        ...createUserSlice(set, get, store),
        ...createModelSlice(set, get, store),
        ...createSchemaSlice(set, get, store),
        ...createSearchSlice(set, get, store),
        ...createMetaSlice(set, get, store),
        ...createDrawerSlice(set, get, store),
        ...createDocumentSlice(set, get, store),
    }))
);
