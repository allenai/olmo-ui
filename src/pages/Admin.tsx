import { useEffect } from 'react';
import * as React from 'react';
import styled from 'styled-components';
import { Box, Button, Tab, Typography } from '@mui/material';
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

import { RemoteState } from '../contexts/util';
import { useAppContext } from '../AppContext';
import { LabelRating, LabelsApiUrl } from '../api/Label';
import { PromptTemplates } from './PromptTemplates';
import { dateTimeFormat } from '../util';

const EXPORT_LIMIT = 1000000; // The maximum rows that an admin can export is limited to 1,000,000
interface Pagination {
    page: number;
    pageSize: number;
}

export const Admin = () => {
    const getAllLabels = useAppContext((state) => state.getAllLabels);
    const getAllSortedLabels = useAppContext((state) => state.getAllSortedLabels);
    const getAllFilteredLabels = useAppContext((state) => state.getAllFilteredLabels);
    const allLabels = useAppContext((state) => state.allLabels);
    const allLabelsRemoteState = useAppContext((state) => state.allLabelsRemoteState);

    const exportURL = `${LabelsApiUrl}?export&limit=${EXPORT_LIMIT}`;
    const [curTab, setCurTab] = React.useState<string>('labels');
    const [pagination, setPagination] = React.useState<Pagination>({
        page: 0,
        pageSize: 10,
    });

    useEffect(() => {
        getAllLabels(pagination.page * pagination.pageSize, pagination.pageSize);
    }, []);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
        setCurTab(newValue);
    };

    enum TabKey {
        Labels = 'labels',
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
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                dayjs(params.value).format(dateTimeFormat),
            minWidth: 150,
            flex: 1,
        },
        {
            field: 'deleted',
            headerName: 'Deleted',
            align: 'right',
            valueGetter: (params: GridValueGetterParams) =>
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                params.value ? dayjs(params.value).format(dateTimeFormat) : '',
            minWidth: 150,
            flex: 1,
        },
    ];

    const handleOnSortModelChange = (model: GridSortModel) => {
        // in case when user click unsort we reset everything back to the original stage
        // which is the current pagination that we are on
        if (model.length === 0) {
            getAllLabels(pagination.page * pagination.pageSize, pagination.pageSize);
            return;
        }

        if (model[0].field && model[0].field === 'created' && model[0].sort) {
            getAllSortedLabels(model[0].field, model[0].sort);
        }
    };

    const handleOnFilterModelChange = (model: GridFilterModel) => {
        // when user clear out the filter we want to reset to original stage.
        if (model.items.length === 0) {
            getAllLabels(pagination.page * pagination.pageSize, pagination.pageSize);
            return;
        }

        // handle rating filtering case
        if (model.items[0].field && model.items[0].field === 'rating' && model.items[0].value) {
            switch (model.items[0].value) {
                case 'Positive':
                    getAllFilteredLabels(undefined, undefined, LabelRating.Positive);
                    break;
                case 'Negative':
                    getAllFilteredLabels(undefined, undefined, LabelRating.Negative);
                    break;
                default:
                    getAllFilteredLabels(undefined, undefined, LabelRating.Flag);
                    break;
            }
        }

        // handle creator filtering case
        if (model.items[0].field && model.items[0].field === 'creator' && model.items[0].value) {
            getAllFilteredLabels(model.items[0].value, undefined, undefined);
        }

        // handle message filtering case
        if (model.items[0].field && model.items[0].field === 'message' && model.items[0].value) {
            getAllFilteredLabels(undefined, model.items[0].value, undefined);
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
                    <Tab
                        label={<TabLabel>Prompt Templates</TabLabel>}
                        value={TabKey.PromptTemplates}
                    />
                </TabList>
                <TabPanel value={TabKey.Labels}>
                    <ExportButton variant="outlined" href={exportURL}>
                        Export all Labels
                    </ExportButton>
                    {allLabelsRemoteState === RemoteState.Error ? null : (
                        <DataGrid
                            loading={allLabelsRemoteState === RemoteState.Loading}
                            rows={allLabels?.labels || []}
                            rowCount={allLabels?.meta.total || 0}
                            initialState={{ pagination: { paginationModel: pagination } }}
                            paginationMode="server"
                            onPaginationModelChange={(model) => {
                                setPagination({
                                    page: model.page,
                                    pageSize: model.pageSize,
                                });
                                getAllLabels(model.page * model.pageSize, model.pageSize);
                            }}
                            onSortModelChange={(model) => {
                                handleOnSortModelChange(model);
                            }}
                            onFilterModelChange={(model) => {
                                handleOnFilterModelChange(model);
                            }}
                            columns={labelColumns}
                            pageSizeOptions={[10, 25, 50, 100]}
                            disableRowSelectionOnClick
                        />
                    )}
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

const ExportButton = styled(Button)`
    && {
        margin-bottom: 10px;
    }
`;
