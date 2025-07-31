import deepmerge from 'deepmerge';
import { DeepPartial } from 'react-hook-form';
import { StateCreator, useStore } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createStore } from 'zustand/vanilla';

import { AttributionSlice, createAttributionSlice } from './slices/attribution/AttributionSlice';
import { CompareModelSlice, createCompareModelSlice } from './slices/CompareModelSlice';
import { createDocumentSlice, DocumentSlice } from './slices/DocumentSlice';
import { createDrawerSlice, DrawerSlice } from './slices/DrawerSlice';
import { createGlobalThreadsUISlice, GlobalThreadsUISlice } from './slices/GlobalThreadsUISlice';
import { createLabelSlice, LabelSlice } from './slices/LabelSlice';
import { createMetaSlice, MetaSlice } from './slices/MetaSlice';
import { createModelSlice, ModelSlice } from './slices/ModelSlice';
import { createPromptTemplateSlice, PromptTemplateSlice } from './slices/PromptTemplateSlice';
import { createSchemaSlice, SchemaSlice } from './slices/SchemaSlice';
import { createSearchSlice, SearchSlice } from './slices/SearchSlice';
import { createSelectedThreadSlice, SelectedThreadSlice } from './slices/SelectedThreadSlice';
import { createSnackMessageSlice, SnackMessageSlice } from './slices/SnackMessageSlice';
import { createThreadSlice, ThreadSlice } from './slices/ThreadSlice';
import { createThreadStreamSlice, ThreadStreamSlice } from './slices/ThreadStreamSlice';
import { createThreadUpdateSlice, ThreadUpdateSlice } from './slices/ThreadUpdateSlice';
import { createTranscriptionSlice, TranscriptionSlice } from './slices/TranscriptionSlice';
import { createUserSlice, UserSlice } from './slices/UserSlice';

type DatasetExplorerSliceStates = SearchSlice & MetaSlice & DocumentSlice;

export type AppContextState = LabelSlice &
    PromptTemplateSlice &
    ThreadSlice &
    ThreadStreamSlice &
    SnackMessageSlice &
    UserSlice &
    ModelSlice &
    CompareModelSlice &
    SchemaSlice &
    DrawerSlice &
    ThreadUpdateSlice &
    TranscriptionSlice &
    SelectedThreadSlice &
    GlobalThreadsUISlice &
    DatasetExplorerSliceStates &
    AttributionSlice;

export type ZustandDevtools = [['zustand/devtools', never], ['zustand/immer', never]];
export type OlmoStateCreator<TOwnSlice> = StateCreator<
    AppContextState,
    ZustandDevtools,
    [],
    TOwnSlice
>;

export const createAppContext = (
    initialState?: OlmoStateCreator<unknown> | DeepPartial<AppContextState>
) => {
    return createStore<AppContextState>()(
        devtools(
            immer((...store) =>
                deepmerge(
                    {
                        ...createPromptTemplateSlice(...store),
                        ...createSnackMessageSlice(...store),
                        ...createThreadSlice(...store),
                        ...createThreadStreamSlice(...store),
                        ...createLabelSlice(...store),
                        ...createUserSlice(...store),
                        ...createModelSlice(...store),
                        ...createCompareModelSlice(...store),
                        ...createSchemaSlice(...store),
                        ...createDrawerSlice(...store),
                        ...createSearchSlice(...store),
                        ...createMetaSlice(...store),
                        ...createDocumentSlice(...store),
                        ...createThreadUpdateSlice(...store),
                        ...createTranscriptionSlice(...store),
                        ...createSelectedThreadSlice(...store),
                        ...createGlobalThreadsUISlice(...store),
                        ...createAttributionSlice(...store),
                    } satisfies AppContextState,
                    (typeof initialState === 'function' ? initialState(...store) : initialState) ??
                        {}
                )
            )
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

// @ts-expect-error - Making a new function to be able to show T&Cs whenever we want
window.showTermsAndConditions = () => {
    appContext.getState().updateTermsAndConditions(false);
};
