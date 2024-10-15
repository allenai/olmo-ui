import { Pagination, Paper, Stack, Typography } from '@mui/material';
import { DataGrid, gridClasses, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';
import { useLoaderData } from 'react-router-dom';

import { DolmaResponse } from './DolmaTabs';
import { DomainLink } from './DomainLink';
import { useSmallLayoutOrUp } from './shared';

export interface DomainData {
    source: string;
    domain: string;
    docCount: number;
}

export interface TreeData {
    name: string;
    color: string;
    value?: number;
    children?: TreeData[];
}

export const DomainsTable = () => {
    const domainData = (useLoaderData() as DolmaResponse).domainData;
    const isSmallLayoutOrUp = useSmallLayoutOrUp();
    const [page, setPage] = React.useState<number>(1);
    const onPageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const columns: GridColDef<DomainData>[] = [
        {
            field: 'domain',
            headerName: 'Domain',
            minWidth: 150,
            flex: 3,
            renderCell: (params: GridRenderCellParams) => (
                <DomainLink link={params.value as string} />
            ),
        },
        {
            field: 'source',
            headerName: 'Source',
            minWidth: 150,
            flex: 2,
        },
        {
            field: 'docCount',
            headerName: 'Documents',
            align: 'left',
            headerAlign: 'left',
            sortComparator: (a: number, b: number) => a - b,
            minWidth: 150,
            flex: 1,
            type: 'number',
        },
    ];

    const narrowColumns: GridColDef<DomainData>[] = [
        {
            field: 'domain',
            flex: 3,
            renderCell: (params: GridRenderCellParams) => (
                <Stack alignItems="flex-start">
                    <DomainLink link={params.value as string} />
                    <Typography>{params.row.source}</Typography>
                </Stack>
            ),
        },
        {
            field: 'docCount',
            align: 'right',
            sortComparator: (a: number, b: number) => a - b,
            flex: 1,
            type: 'number',
        },
    ];

    const dataGridConfig = isSmallLayoutOrUp
        ? {
              columns,
              columnHeaderHeight: 32,
              rowHeight: 32,
          }
        : {
              columns: narrowColumns,
              columnHeaderHeight: 0,
          };

    return (
        <Paper
            elevation={isSmallLayoutOrUp ? 2 : 0}
            sx={(theme) => ({
                background: theme.palette.background.default,
                borderRadius: isSmallLayoutOrUp ? theme.spacing(1.5) : 0,
                padding: isSmallLayoutOrUp ? theme.spacing(4) : 0,
            })}>
            <Typography
                variant="h3"
                sx={(theme) => ({
                    marginTop: theme.spacing(4),
                    marginBottom: theme.spacing(2),
                })}>
                Web Domains
            </Typography>
            <DataGrid
                {...dataGridConfig}
                getRowId={(row) => `${row.source}-${row.domain}`}
                rows={domainData}
                slots={{
                    pagination: () => (
                        <Pagination
                            count={Math.ceil(domainData.length / 10)}
                            page={page}
                            size={isSmallLayoutOrUp ? 'medium' : 'small'}
                            onChange={onPageChange}
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    '&.Mui-selected': {
                                        backgroundColor: (theme) => theme.color['dark-blue'].hex, // Background color for the selected item
                                        color: 'white', // Text color for the selected item
                                    },
                                },
                            }}
                            showFirstButton
                            showLastButton
                        />
                    ),
                }}
                paginationModel={{
                    page: page - 1, // this is index
                    pageSize: 10,
                }}
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'docCount', sort: 'desc' }],
                    },
                }}
                disableRowSelectionOnClick
                sx={(theme) => ({
                    border: 0,
                    [`& .${gridClasses.withBorderColor}`]: {
                        border: 0,
                    },
                    [`& .${gridClasses.row}:nth-of-type(odd) `]: {
                        bgcolor: theme.color.N3.hex,
                    },
                    [`& .${gridClasses.footerContainer}`]: {
                        justifyContent: 'flex-start',
                    },
                })}
            />
        </Paper>
    );
};
