import { StateCreator, useStore } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createStore } from 'zustand/vanilla';

import { AlertMessageSlice, createAlertMessageSlice } from './slices/AlertMessageSlice';
import { createDocumentSlice, DocumentSlice } from './slices/DocumentSlice';
import { createDrawerSlice, DrawerSlice } from './slices/DrawerSlice';
import { createLabelSlice, LabelSlice } from './slices/LabelSlice';
import { createMetaSlice, MetaSlice } from './slices/MetaSlice';
import { createModelSlice, ModelSlice } from './slices/ModelSlice';
import { createPromptTemplateSlice, PromptTemplateSlice } from './slices/PromptTemplateSlice';
import { createRepromptSlice, RepromptSlice } from './slices/repromptSlice';
import { createSchemaSlice, SchemaSlice } from './slices/SchemaSlice';
import { createSearchSlice, SearchSlice } from './slices/SearchSlice';
import { createSelectedThreadSlice, SelectedThreadSlice } from './slices/SelectedThreadSlice';
import { createThreadSlice, ThreadSlice } from './slices/ThreadSlice';
import { createThreadUpdateSlice, ThreadUpdateSlice } from './slices/ThreadUpdateSlice';
import { createUserSlice, UserSlice } from './slices/UserSlice';

export type FetchInfo<T> = {
    data?: T;
    loading?: boolean;
    error?: boolean;
};

type DatasetExplorerSliceStates = SearchSlice & MetaSlice & DocumentSlice;

export type AppContextState = LabelSlice &
    PromptTemplateSlice &
    RepromptSlice &
    ThreadSlice &
    AlertMessageSlice &
    UserSlice &
    ModelSlice &
    SchemaSlice &
    DrawerSlice &
    ThreadUpdateSlice &
    SelectedThreadSlice &
    DatasetExplorerSliceStates;

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
