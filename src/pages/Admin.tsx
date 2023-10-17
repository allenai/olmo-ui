import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Box, Tab, Typography } from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridRenderCellParams,
    GridValueGetterParams,
} from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Link } from 'react-router-dom';

import { useAppContext } from '../AppContext';
import { LabelRating } from '../api/Label';
import { DataChips } from './DataChips';
import { PromptTemplates } from './PromptTemplates';
import { dateTimeFormat } from '../util';

export const Admin = () => {
    const { getAllLabels, allLabelInfo } = useAppContext();

    useEffect(() => {
        getAllLabels();
    }, []);

    const [curTab, setCurTab] = React.useState<string>('labels');

    const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
        setCurTab(newValue);
    };

    enum TabKey {
        Labels = 'labels',
        DataChips = 'dataChips',
        PromptTemplates = 'promptTemplates',
    }

    const labelColumns: GridColDef[] = [
        {
            field: 'message',
            headerName: 'Message',
            renderCell: (params: GridRenderCellParams<Date>) => (
                <Link to={`/thread/${params.value}`}>{params.value}</Link>
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
                    <Tab label={<TabLabel>Labels</TabLabel>} value={TabKey.Labels} />
                    <Tab label={<TabLabel>Data Chips</TabLabel>} value={TabKey.DataChips} />
                    <Tab
                        label={<TabLabel>Prompt Templates</TabLabel>}
                        value={TabKey.PromptTemplates}
                    />
                </TabList>
                <TabPanel value={TabKey.Labels}>
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
                            pageSizeOptions={[10, 25, 50, 100]}
                            disableRowSelectionOnClick
                        />
                    ) : null}
                </TabPanel>
                <TabPanel value={TabKey.DataChips}>
                    <DataChips hideTitle />
                </TabPanel>
                <TabPanel value={TabKey.PromptTemplates}>
                    <PromptTemplates hideTitle />
                </TabPanel>
            </TabContext>
        </Box>
    );
};

const TabLabel = styled(Typography).attrs({ variant: 'h4' })`
    &&& {
        margin: 0;
    }
`;
