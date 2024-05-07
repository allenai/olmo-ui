import { Grid } from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridRenderCellParams,
    GridValueGetterParams,
} from '@mui/x-data-grid';
import { Chip } from '@nivo/tooltip';

import { staticData } from '../../api/dolma/staticData';

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

interface Props {
    domains: DomainData[];
    sources: staticData.Sources;
    loading?: boolean;
}

export const DomainsTable = ({ domains, sources, loading }: Props) => {
    const columns: GridColDef<DomainData>[] = [
        {
            field: 'domain',
            headerName: 'Domain',
            minWidth: 150,
            flex: 2,
        },
        {
            field: 'source',
            headerName: 'Source',
            valueGetter: (params: GridValueGetterParams<DomainData>) => sources[params.value].label,
            renderCell: (params: GridRenderCellParams<DomainData>) => (
                <Grid
                    container
                    sx={{ alignItems: 'center' }}
                    wrap="nowrap"
                    direction="row"
                    columnGap={1}>
                    <Grid item>
                        <Chip color={sources[params.row.source].color} />
                    </Grid>
                    <Grid item>{params.value}</Grid>
                </Grid>
            ),
            minWidth: 150,
            flex: 1,
            type: 'singleSelect',
            valueOptions: Object.values(sources).map((s) => s.label),
        },
        {
            field: 'docCount',
            headerName: 'Documents',
            sortComparator: (a: number, b: number) => a - b,
            renderCell: (params: GridRenderCellParams<DomainData>) => params.value.toLocaleString(),
            minWidth: 150,
            flex: 1,
            type: 'number',
        },
    ];

    return (
        <>
            <DataGrid
                loading={loading}
                getRowId={(row) => `${row.source}-${row.domain}`}
                rows={domains}
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
                pageSizeOptions={[10, 25, 50, 100]}
                disableRowSelectionOnClick
            />
        </>
    );
};
