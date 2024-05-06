import { Grid } from '@mui/material';
import { ResponsiveSunburst } from '@nivo/sunburst';
import { Chip } from '@nivo/tooltip';

import { TreeData } from './DomainsTable';
import { ChartContainerSansLegend } from './sharedCharting';

interface Props {
    data: TreeData;
}

export const DomainStarBurst = ({ data }: Props) => {
    return (
        <ChartContainerSansLegend>
            <ResponsiveSunburst<TreeData>
                data={data}
                margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                id={(d: TreeData) => d.name + d.color}
                value="value"
                tooltip={(d: { data: TreeData }) => {
                    return (
                        <Grid
                            container
                            sx={{
                                alignItems: 'center',
                                background: 'white',
                                p: 1,
                                border: '1px solid #F8F9FA',
                            }}
                            wrap="nowrap"
                            direction="row"
                            columnGap={1}>
                            <Grid item>
                                <Chip color={d.data.color} />
                            </Grid>
                            <Grid item>{d.data.name}</Grid>
                            {d.data.value ? (
                                <Grid item>
                                    <b>{d.data.value.toLocaleString()} documents</b>
                                </Grid>
                            ) : null}
                        </Grid>
                    );
                }}
                arcLabel={(a) => (a.depth === 1 ? a.data.name : '')}
                cornerRadius={0}
                borderColor={{
                    from: 'color',
                    modifiers: [['darker', 0.4]],
                }}
                colors={(d: { data: TreeData }) => d.data.color}
                childColor={{
                    from: 'color',
                    modifiers: [['brighter', 0.4]],
                }}
                enableArcLabels={true}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                    from: 'color',
                    modifiers: [['darker', 1.4]],
                }}
            />
        </ChartContainerSansLegend>
    );
};
