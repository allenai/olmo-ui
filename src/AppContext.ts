import { createStore } from 'zustand/vanilla';
import { StateCreator, useStore } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { PromptTemplateSlice, createPromptTemplateSlice } from './slices/PromptTemplateSlice';
import { RepromptSlice, createRepromptSlice } from './slices/repromptSlice';
import { ThreadSlice, createThreadSlice } from './slices/ThreadSlice';
import { AlertMessageSlice, createAlertMessageSlice } from './slices/AlertMessageSlice';
import { LabelSlice, createLabelSlice } from './slices/LabelSlice';
import { UserSlice, createUserSlice } from './slices/UserSlice';
import { ModelSlice, createModelSlice } from './slices/ModelSlice';
import { SchemaSlice, createSchemaSlice } from './slices/SchemaSlice';
import { DrawerSlice, createDrawerSlice } from './slices/DrawerSlice';
import { SearchSlice, createSearchSlice } from './slices/SearchSlice';
import { MetaSlice, createMetaSlice } from './slices/MetaSlice';
import { DocumentSlice, createDocumentSlice } from './slices/DocumentSlice';

import { ThreadUpdateSlice, createThreadUpdateSlice } from './slices/ThreadUpdateSlice';
import { SelectedThreadSlice, createSelectedThreadSlice } from './slices/SelectedThreadSlice';

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
    DrawerSlice &
    SearchSlice &
    MetaSlice &
    ThreadUpdateSlice &
    SelectedThreadSlice &
    DocumentSlice;

export const appContext = createStore<AppContextState>()(
    devtools(
        immer((...store) => ({
            ...createRepromptSlice(...store),
            ...createPromptTemplateSlice(...store),
            ...createAlertMessageSlice(...store),
            ...createThreadSlice(...store),
            ...createLabelSlice(...store),
            ...createUserSlice(...store),
            ...createModelSlice(...store),
            ...createSchemaSlice(...store),
            ...createDrawerSlice(...store),
            ...createSearchSlice(...store),
            ...createMetaSlice(...store),
            ...createDocumentSlice(...store),
            ...createThreadUpdateSlice(...store),
            ...createSelectedThreadSlice(...store),
        }))
    )
);

export const useAppContext = <U>(
    selector: Parameters<typeof useStore<typeof appContext, U>>[1]
): U => useStore(appContext, selector);

export type ZustandDevtools = [['zustand/devtools', never], ['zustand/immer', never]];
export type OlmoStateCreator<TOwnSlice> = StateCreator<
    AppContextState,
    ZustandDevtools,
    [],
    TOwnSlice
>;
