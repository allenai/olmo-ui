import { StateCreator, useStore } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createStore } from 'zustand/vanilla';

import { AttributionSlice, createAttributionSlice } from './slices/attribution/AttributionSlice';
import { createDocumentSlice, DocumentSlice } from './slices/DocumentSlice';
import { createDrawerSlice, DrawerSlice } from './slices/DrawerSlice';
import { createLabelSlice, LabelSlice } from './slices/LabelSlice';
import { createMetaSlice, MetaSlice } from './slices/MetaSlice';
import { createModelSlice, ModelSlice } from './slices/ModelSlice';
import { createPromptTemplateSlice, PromptTemplateSlice } from './slices/PromptTemplateSlice';
import { createSchemaSlice, SchemaSlice } from './slices/SchemaSlice';
import { createSearchSlice, SearchSlice } from './slices/SearchSlice';
import { createSelectedThreadSlice, SelectedThreadSlice } from './slices/SelectedThreadSlice';
import { createSnackMessageSlice, SnackMessageSlice } from './slices/SnackMessageSlice';
import { createThreadSlice, ThreadSlice } from './slices/ThreadSlice';
import { createThreadUpdateSlice, ThreadUpdateSlice } from './slices/ThreadUpdateSlice';
import { createUserSlice, UserSlice } from './slices/UserSlice';

type DatasetExplorerSliceStates = SearchSlice & MetaSlice & DocumentSlice;

export type AppContextState = LabelSlice &
    PromptTemplateSlice &
    ThreadSlice &
    SnackMessageSlice &
    UserSlice &
    ModelSlice &
    SchemaSlice &
    DrawerSlice &
    ThreadUpdateSlice &
    SelectedThreadSlice &
    DatasetExplorerSliceStates &
    AttributionSlice;

export const createAppContext = (initialState?: Partial<AppContextState>) => {
    return createStore<AppContextState>()(
        devtools(
            immer((...store) => ({
                ...createPromptTemplateSlice(...store),
                ...createSnackMessageSlice(...store),
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
                ...createAttributionSlice(...store),
                ...initialState,
            }))
        )
    );
};

export const appContext = createAppContext();

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
