import { Link, Pagination, Paper, Typography } from '@mui/material';
import { DataGrid, gridClasses, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';
import { useLoaderData } from 'react-router-dom';

import { DolmaResponse } from './DolmaTabs';

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
            renderCell: (params: GridRenderCellParams) => {
                return (
                    <Link
                        href={`http://${params.value}`}
                        target="_blank"
                        underline="none"
                        rel="noopener">
                        <Typography
                            sx={() => ({
                                fontWeight: 700,
                            })}>
                            {params.value}
                        </Typography>
                    </Link>
                );
            },
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

    return (
        <Paper
            elevation={2}
            sx={(theme) => ({
                background: theme.palette.background.default,
                borderRadius: theme.spacing(1.5),
                padding: theme.spacing(4),
            })}>
            <Typography
                variant="h3"
                sx={(theme) => ({
                    marginTop: theme.spacing(4),
                    marginBottom: theme.spacing(2),
                })}>
                Domains
            </Typography>
            <DataGrid
                loading={false}
                getRowId={(row) => `${row.source}-${row.domain}`}
                rows={domainData}
                columnHeaderHeight={32}
                rowHeight={32}
                columns={columns}
                slots={{
                    pagination: () => (
                        <Pagination
                            count={Math.ceil(domainData.length / 10)}
                            page={page}
                            onChange={onPageChange}
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
                        bgcolor: theme.palette.background.paper,
                    },
                    [`& .${gridClasses.footerContainer}`]: {
                        justifyContent: 'flex-start',
                    },
                })}
            />
        </Paper>
    );
};
