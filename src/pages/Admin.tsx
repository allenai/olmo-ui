import React, { useEffect } from 'react';
import { Box, Tab, Typography } from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridRenderCellParams,
    GridValueGetterParams,
} from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import { useAppContext } from '../AppContext';
import { LabelRating } from '../api/Label';

export const Admin = () => {
    const { getAllLabels, allLabelInfo } = useAppContext();

    useEffect(() => {
        getAllLabels();
    }, []);

    const [curTab, setCurTab] = React.useState<string>('labels');

    const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
        setCurTab(newValue);
    };

    const dateTimeFormat = 'M/D/YY h:mm a';

    const labelColumns: GridColDef[] = [
        {
            field: 'message',
            headerName: 'Message',
            renderCell: (params: GridRenderCellParams<Date>) => (
                <a href={`/thread/${params.value}`}>{params.value}</a>
            ),
            minWidth: 160,
            flex: 1,
        },
        {
            field: 'rating',
            headerName: 'Rating',
            valueGetter: (params: GridValueGetterParams) => LabelRating[params.value],
            minWidth: 115,
            flex: 1,
        },
        {
            field: 'comment',
            headerName: 'Comment',
            minWidth: 145,
            flex: 5,
        },
        {
            field: 'creator',
            headerName: 'Creator',
            minWidth: 205,
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
            field: 'deleted',
            headerName: 'Deleted',
            align: 'right',
            valueGetter: (params: GridValueGetterParams) =>
                params.value ? dayjs(params.value).format(dateTimeFormat) : '',
            minWidth: 150,
            flex: 1,
        },
    ];

    return (
        <Box sx={{ width: '100%', background: 'white', p: 2 }}>
            <Typography variant="h1" sx={{ m: 0 }}>
                Admin
            </Typography>
            <TabContext value={curTab}>
                <TabList onChange={handleTabChange}>
                    <Tab
                        label={
                            <Typography variant="h4" sx={{ m: 0 }}>
                                Labels
                            </Typography>
                        }
                        value="labels"
                    />
                </TabList>
                <TabPanel value="labels">
                    {!allLabelInfo.error ? (
                        <DataGrid
                            loading={allLabelInfo.loading}
                            rows={allLabelInfo.data || []}
                            columns={labelColumns}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 25,
                                    },
                                },
                            }}
                            pageSizeOptions={[10, 25, 50, 100, 1000]}
                            disableRowSelectionOnClick
                        />
                    ) : null}
                </TabPanel>
            </TabContext>
        </Box>
    );
};
