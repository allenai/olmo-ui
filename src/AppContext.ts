import deepmerge from 'deepmerge';
import type { DeepPartial } from 'react-hook-form';
import type { StateCreator } from 'zustand';
import { useStore } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createStore } from 'zustand/vanilla';

import type { AttributionSlice } from './slices/attribution/AttributionSlice';
import { createAttributionSlice } from './slices/attribution/AttributionSlice';
import type { CompareModelSlice } from './slices/CompareModelSlice';
import { createCompareModelSlice } from './slices/CompareModelSlice';
import type { DrawerSlice } from './slices/DrawerSlice';
import { createDrawerSlice } from './slices/DrawerSlice';
import type { GlobalThreadsUISlice } from './slices/GlobalThreadsUISlice';
import { createGlobalThreadsUISlice } from './slices/GlobalThreadsUISlice';
import type { LabelSlice } from './slices/LabelSlice';
import { createLabelSlice } from './slices/LabelSlice';
import type { ModelSlice } from './slices/ModelSlice';
import { createModelSlice } from './slices/ModelSlice';
import type { SelectedThreadSlice } from './slices/SelectedThreadSlice';
import { createSelectedThreadSlice } from './slices/SelectedThreadSlice';
import type { SnackMessageSlice } from './slices/SnackMessageSlice';
import { createSnackMessageSlice } from './slices/SnackMessageSlice';
import type { ThreadStreamSlice } from './slices/ThreadStreamSlice';
import { createThreadStreamSlice } from './slices/ThreadStreamSlice';
import type { ThreadUpdateSlice } from './slices/ThreadUpdateSlice';
import { createThreadUpdateSlice } from './slices/ThreadUpdateSlice';
import type { UserSlice } from './slices/UserSlice';
import { createUserSlice } from './slices/UserSlice';

export type AppContextState = LabelSlice &
    ThreadStreamSlice &
    SnackMessageSlice &
    UserSlice &
    ModelSlice &
    CompareModelSlice &
    DrawerSlice &
    ThreadUpdateSlice &
    SelectedThreadSlice &
    GlobalThreadsUISlice &
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
                        ...createSnackMessageSlice(...store),
                        ...createThreadStreamSlice(...store),
                        ...createLabelSlice(...store),
                        ...createUserSlice(...store),
                        ...createModelSlice(...store),
                        ...createCompareModelSlice(...store),
                        ...createDrawerSlice(...store),
                        ...createThreadUpdateSlice(...store),
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
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    typeof useStore<typeof appContext, TSelectorReturnValue>
>[1];

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

window.showTermsAndConditions = () => {
    appContext
        .getState()
        .updateUserTermsAndDataCollection({ hasAcceptedTermsAndConditions: false })
        .catch((e: unknown) => {
            console.error('There was an error opening the terms and conditions', e);
        });
};
