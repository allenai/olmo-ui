// context exposing client actions on DatCchips

import React, { createContext, ReactNode, useState } from 'react';

import { DataChipClient } from '../api/DataChipClient';
import { DataChip, DataChipList, DataChipPost } from '../api/DataChip';
import { RemoteState, replaceItemInArray, useContext } from './util';

interface DataChipContextProps {
    remoteState?: RemoteState;
    dataChipList: DataChipList;
    getDataChipList: (includeDeleted?: boolean) => Promise<DataChipList>;
    getDataChip(id: string): Promise<DataChip>;
    createDataChip(chipData: DataChipPost): Promise<DataChip>;
    updateDeletedOnDataChip(id: string, deleteValue?: boolean): Promise<DataChip>;
}

const DataChipContext = createContext<DataChipContextProps | undefined>(undefined);

export const useDataChip = () => useContext(DataChipContext, 'DataChip');

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
                setDataChipList({
                    ...dataChipList,
                    dataChips: replaceItemInArray(dataChipList.dataChips, r),
                });
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
                setDataChipList({ ...dataChipList, dataChips: [...dataChipList.dataChips, r] });
                setRemoteState(RemoteState.Loaded);
                return r;
            })
            .catch((e) => {
                setRemoteState(RemoteState.Error);
                return e;
            });
    };

    const updateDeletedOnDataChip = async (
        id: string,
        deleteValue: boolean = true
    ): Promise<DataChip> => {
        setRemoteState(RemoteState.Loading);
        return dataChipClient
            .updateDeletedOnDataChip(id, deleteValue)
            .then((r) => {
                setDataChipList({
                    ...dataChipList,
                    dataChips: replaceItemInArray(dataChipList.dataChips, r),
                });
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
                updateDeletedOnDataChip,
            }}>
            {children}
        </DataChipContext.Provider>
    );
};
