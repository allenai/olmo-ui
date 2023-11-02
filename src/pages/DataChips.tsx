import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton, Typography, Chip, ButtonProps } from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridRenderCellParams,
    GridValueGetterParams,
} from '@mui/x-data-grid';
import dayjs from 'dayjs';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOffOutlined';
import AddIcon from '@mui/icons-material/Add';
import TuneIcon from '@mui/icons-material/Tune';

import { DataChip } from '../api/DataChip';
import { DataChipEditorButtonWrapper } from '../components/ModalEditors/DataChipEditorButtonWrapper';
import { dateTimeFormat } from '../util';
import { useAppContext } from '../AppContext';
import { useDataChip } from '../contexts/dataChipContext';
import { RemoteState } from '../contexts/util';

export const DataChips = ({ hideTitle }: { hideTitle?: boolean }) => {
    const { userInfo } = useAppContext();
    const { remoteState, dataChipList, getDataChipList, updateDeletedOnDataChip } = useDataChip();

    const [filteredDataChips, setFilteredDataChips] = useState<DataChip[]>([]);
    const [dataChipsLoading, setDataChipsLoading] = useState(false);
    const getDataChips = async function () {
        setDataChipsLoading(true);
        getDataChipList(true).finally(() => {
            setDataChipsLoading(false);
        });
    };

    useEffect(() => {
        getDataChips();
    }, []);

    useEffect(() => {
        setFilteredDataChips(
            dataChipList.dataChips.filter((chip) => {
                return userInfo.data?.client === chip.creator || !chip.deleted;
            })
        );
    }, [dataChipList]);

    const chipColumns: GridColDef<DataChip>[] = [
        {
            field: 'name',
            headerName: 'Name',
            renderCell: (params: GridRenderCellParams<DataChip>) => <Chip label={params.value} />,
            minWidth: 170,
            flex: 2,
        },
        {
            field: 'content',
            headerName: 'Content',
            renderCell: (params: GridRenderCellParams<DataChip>) => (
                <Typography sx={{ fontWeight: 'bold' }} noWrap>
                    {params.value}
                </Typography>
            ),
            minWidth: 170,
            flex: 5,
        },
        {
            field: 'characters',
            headerName: 'Characters',
            align: 'right',
            sortComparator: (a: number, b: number) => a - b,
            valueGetter: (params: GridValueGetterParams<DataChip>) => params.row.content.length,
            renderCell: (params: GridRenderCellParams<DataChip>) => params.value.toLocaleString(),
            minWidth: 100,
            flex: 1,
        },
        {
            field: 'creator',
            headerName: 'Creator',
            minWidth: 150,
            flex: 1,
        },
        {
            field: 'created',
            headerName: 'Created',
            align: 'right',
            valueGetter: (params: GridValueGetterParams) =>
                dayjs(params.value).format(dateTimeFormat),
            minWidth: 150,
            flex: 1,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params: GridRenderCellParams<DataChip>) => {
                return userInfo.data?.client === params.row.creator ? (
                    <>
                        {!params.row.deleted ? (
                            <IconButton
                                aria-label="visible"
                                onClick={() => updateDeletedOnDataChip(params.row.id, true)}>
                                <VisibilityIcon />
                            </IconButton>
                        ) : (
                            <IconButton
                                aria-label="hidden"
                                onClick={() => updateDeletedOnDataChip(params.row.id, false)}>
                                <VisibilityOffIcon />
                            </IconButton>
                        )}
                        <DataChipEditorButtonWrapper
                            chip={params.row}
                            renderButton={(props: ButtonProps) => (
                                <IconButton aria-label="hidden" {...props}>
                                    <TuneIcon />
                                </IconButton>
                            )}
                        />
                    </>
                ) : null;
            },
            minWidth: 90,
            flex: 1,
        },
    ];

    return (
        <Box sx={{ width: '100%', background: 'white', p: 2 }}>
            {!hideTitle ? (
                <Typography variant="h1" sx={{ m: 0 }}>
                    Data Chips
                </Typography>
            ) : null}

            <DataGrid
                loading={dataChipsLoading || remoteState === RemoteState.Loading}
                rows={filteredDataChips}
                columns={chipColumns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 25,
                        },
                    },
                }}
                pageSizeOptions={[10, 25, 50, 100]}
                disableRowSelectionOnClick
                slots={{
                    footer: () => (
                        <Box alignSelf="end" sx={{ mt: 2 }}>
                            <DataChipEditorButtonWrapper
                                renderButton={(props) => (
                                    <Button
                                        variant="contained"
                                        endIcon={<AddIcon />}
                                        aria-label="Create New"
                                        {...props}>
                                        Create New Data Chip
                                    </Button>
                                )}
                            />
                        </Box>
                    ),
                }}
            />
        </Box>
    );
};
