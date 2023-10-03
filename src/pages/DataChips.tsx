/*
    TODO:
    1- (blocked on api) load chips form api
    set loading flag on table
    2- (blocked on api) save changes to chips to api
*/

import React from 'react';
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
import { mockChips } from '../components/draft/mockData';
import { DataChipEditorButtonWrapper } from '../components/ModalEditors/DataChipEditorButtonWrapper';
import { dateTimeFormat } from '../olmoTheme';
import { useFeatureToggles } from '../FeatureToggleContext';

export const DataChips = ({ hideTitle }: { hideTitle?: boolean }) => {
    const toggles = useFeatureToggles();
    if (!toggles.chips) {
        return <></>;
    }

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
            renderCell: (params: GridRenderCellParams<DataChip>) => (
                <>
                    {!params.row.deleted ? (
                        <IconButton
                            aria-label="visible"
                            onClick={() => setArchiveChip(params.row, true)}>
                            <VisibilityIcon />
                        </IconButton>
                    ) : (
                        <IconButton
                            aria-label="hidden"
                            onClick={() => setArchiveChip(params.row, false)}>
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
            ),
            minWidth: 90,
            flex: 1,
        },
    ];

    // likely to be replaced with a direct call to app context
    const setArchiveChip = (chip: DataChip | undefined, value: boolean) => {
        if (chip) {
            console.log(`todo: ${value ? 'archive' : 'restore'} chip: ${chip.name}`);
        }
    };

    return (
        <Box sx={{ width: '100%', background: 'white', p: 2 }}>
            {!hideTitle ? (
                <Typography variant="h1" sx={{ m: 0 }}>
                    Data Chips
                </Typography>
            ) : null}

            <DataGrid
                loading={false /* todo */}
                rows={mockChips}
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
