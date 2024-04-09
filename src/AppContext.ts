import { StateCreator, useStore } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createStore } from 'zustand/vanilla';

import { AlertMessageSlice, createAlertMessageSlice } from './slices/AlertMessageSlice';
import { DocumentSlice, createDocumentSlice } from './slices/DocumentSlice';
import { DrawerSlice, createDrawerSlice } from './slices/DrawerSlice';
import { LabelSlice, createLabelSlice } from './slices/LabelSlice';
import { MetaSlice, createMetaSlice } from './slices/MetaSlice';
import { ModelSlice, createModelSlice } from './slices/ModelSlice';
import { PromptTemplateSlice, createPromptTemplateSlice } from './slices/PromptTemplateSlice';
import { SchemaSlice, createSchemaSlice } from './slices/SchemaSlice';
import { SearchSlice, createSearchSlice } from './slices/SearchSlice';
import { ThreadSlice, createThreadSlice } from './slices/ThreadSlice';
import { UserSlice, createUserSlice } from './slices/UserSlice';
import { RepromptSlice, createRepromptSlice } from './slices/repromptSlice';

import { SelectedThreadSlice, createSelectedThreadSlice } from './slices/SelectedThreadSlice';
import { ThreadUpdateSlice, createThreadUpdateSlice } from './slices/ThreadUpdateSlice';

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

type SelectorType<TSelectorReturnValue> = Parameters<
    typeof useStore<typeof appContext, TSelectorReturnValue>
>[1];

/* eslint-disable no-redeclare */
export function useAppContext(): AppContextState;
export function useAppContext<TSelectorReturnValue>(
    selector: SelectorType<TSelectorReturnValue>
): TSelectorReturnValue;

export function useAppContext<TSelectorReturnValue>(selector?: SelectorType<TSelectorReturnValue>) {
    if (selector == null) {
        return useStore(appContext);
    }

    return useStore(appContext, selector);
}
/* eslint-enable no-redeclare */

export type ZustandDevtools = [['zustand/devtools', never], ['zustand/immer', never]];
export type OlmoStateCreator<TOwnSlice> = StateCreator<
    AppContextState,
    ZustandDevtools,
    [],
    TOwnSlice
>;
