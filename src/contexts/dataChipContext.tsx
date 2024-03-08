// context exposing client actions on DataChips
import { ReactNode, createContext, useState } from 'react';
import { produce } from 'immer';

import { DataChipClient } from '../api/DataChipClient';
import { DataChip, DataChipList, DataChipPatch, DataChipPost } from '../api/DataChip';
import { RemoteState, ensureContext } from './util';

interface DataChipContextProps {
    remoteState?: RemoteState;
    dataChipList: DataChipList;
    getDataChipList: (includeDeleted?: boolean) => Promise<DataChipList>;
    getDataChip(id: string): Promise<DataChip>;
    createDataChip(chipData: DataChipPost): Promise<DataChip>;
    patchDataChip(id: string, patchValues: DataChipPatch): Promise<DataChip>;
}

const DataChipContext = createContext<DataChipContextProps | undefined>(undefined);

export const useDataChip = () => ensureContext(DataChipContext, 'DataChips');

export const DataChipProvider = ({ children }: { children: ReactNode }) => {
    const dataChipClient = new DataChipClient();

    const [remoteState, setRemoteState] = useState<RemoteState>();
    const [dataChipList, setDataChipList] = useState<DataChipList>({
        dataChips: [],
        meta: { total: 0 },
    });

    const getDataChipList = async (includeDeleted?: boolean): Promise<DataChipList> => {
        setRemoteState(RemoteState.Loading);
        return dataChipClient
            .getDataChipList(includeDeleted)
            .then((r) => {
                setDataChipList(r);
                setRemoteState(RemoteState.Loaded);
                return r;
            })
            .catch((e) => {
                setRemoteState(RemoteState.Error);
                return e;
            });
    };

    const getDataChip = async (id: string): Promise<DataChip> => {
        setRemoteState(RemoteState.Loading);
        return dataChipClient
            .getDataChip(id)
            .then((r) => {
                const updated = produce(dataChipList, (draft) => {
                    const index = draft.dataChips.findIndex((dc) => dc.id === id);
                    if (index !== -1) {
                        draft.dataChips[index] = r;
                    }
                });
                setDataChipList(updated);
                setRemoteState(RemoteState.Loaded);
                return r;
            })
            .catch((e) => {
                setRemoteState(RemoteState.Error);
                return e;
            });
    };

    const createDataChip = async (chipData: DataChipPost): Promise<DataChip> => {
        setRemoteState(RemoteState.Loading);
        return dataChipClient
            .createDataChip(chipData)
            .then((r) => {
                const updated = produce(dataChipList, (draft) => {
                    draft.dataChips.unshift(r);
                });
                setDataChipList(updated);
                setRemoteState(RemoteState.Loaded);
                return r;
            })
            .catch((e) => {
                setRemoteState(RemoteState.Error);
                return e;
            });
    };

    const patchDataChip = async (id: string, patchValues: DataChipPatch): Promise<DataChip> => {
        setRemoteState(RemoteState.Loading);
        return dataChipClient
            .patchDataChip(id, patchValues)
            .then((r) => {
                const updated = produce(dataChipList, (draft) => {
                    const index = draft.dataChips.findIndex((dc) => dc.id === id);
                    if (index !== -1) {
                        draft.dataChips[index] = r;
                    }
                });
                setDataChipList(updated);
                setRemoteState(RemoteState.Loaded);
                return r;
            })
            .catch((e) => {
                setRemoteState(RemoteState.Error);
                return e;
            });
    };

    return (
        <DataChipContext.Provider
            value={{
                remoteState,
                dataChipList,
                getDataChipList,
                getDataChip,
                createDataChip,
                patchDataChip,
            }}>
            {children}
        </DataChipContext.Provider>
    );
};
