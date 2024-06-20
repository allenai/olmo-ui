import { Link, Paper, Typography } from '@mui/material';
import { DataGrid, gridClasses, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useLoaderData } from 'react-router-dom';

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
    const domainData = (useLoaderData() || []) as DomainData[];

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
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'docCount', sort: 'desc' }],
                    },
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}
                pageSizeOptions={[10, 25, 50]}
                disableRowSelectionOnClick
                sx={(theme) => ({
                    border: 0,
                    [`& .${gridClasses.withBorderColor}`]: {
                        border: 0,
                    },
                    [`& .${gridClasses.row}:nth-of-type(odd) `]: {
                        bgcolor: theme.palette.background.paper,
                    },
                })}
            />
        </Paper>
    );
};
