import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Box, Tab, Typography } from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridFilterModel,
    GridRenderCellParams,
    GridSortModel,
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
    const { getAllLabels, getAllLabelsBySorting, getAllLabelsByFiltering, allLabelInfo } =
        useAppContext();

    const defaultPagination = { page: 0, pageSize: 10 };
    useEffect(() => {
        getAllLabels(
            defaultPagination.page * defaultPagination.pageSize,
            defaultPagination.pageSize
        );
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

    const handleOnSortModelChange = (model: GridSortModel) => {
        // in case when user click unsort we reset everything back to the original stage
        if (model.length === 0) {
            getAllLabels(
                defaultPagination.page * defaultPagination.pageSize,
                defaultPagination.pageSize
            );
            return;
        }

        if (model[0].field && model[0].field === 'created' && model[0].sort) {
            getAllLabelsBySorting(model[0].field, model[0].sort);
        }
    };

    const handleOnFilterModelChange = (model: GridFilterModel) => {
        // when user clear out the filter we want to reset to original stage.
        if (model.items.length === 0) {
            getAllLabels(
                defaultPagination.page * defaultPagination.pageSize,
                defaultPagination.pageSize
            );
            return;
        }

        // handle rating filtering case
        if (model.items[0].field && model.items[0].field === 'rating' && model.items[0].value) {
            switch (model.items[0].value) {
                case 'Positive':
                    getAllLabelsByFiltering(undefined, undefined, LabelRating.Positive);
                    break;
                case 'Negative':
                    getAllLabelsByFiltering(undefined, undefined, LabelRating.Negative);
                    break;
                default:
                    getAllLabelsByFiltering(undefined, undefined, LabelRating.Flag);
                    break;
            }
        }

        // handle creator filtering case
        if (model.items[0].field && model.items[0].field === 'creator' && model.items[0].value) {
            getAllLabelsByFiltering(model.items[0].value, undefined, undefined);
        }

        // handle message filtering case
        if (model.items[0].field && model.items[0].field === 'message' && model.items[0].value) {
            getAllLabelsByFiltering(undefined, model.items[0].value, undefined);
        }
    };

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
                            rows={allLabelInfo.data?.labels || []}
                            rowCount={allLabelInfo.data?.meta.total || 0}
                            initialState={{ pagination: { paginationModel: defaultPagination } }}
                            paginationMode="server"
                            onPaginationModelChange={(model) => {
                                getAllLabels(model.page * model.pageSize, model.pageSize);
                            }}
                            onSortModelChange={(model) => handleOnSortModelChange(model)}
                            onFilterModelChange={(model) => handleOnFilterModelChange(model)}
                            columns={labelColumns}
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
