import { ResponsiveTreeMap } from '@nivo/treemap';

import { ChartContainerSansLegend } from './sharedCharting';
import { TreeData } from './DomainsTable';

interface Props {
    data: TreeData;
}

export const DomainTreeMap = ({ data }: Props) => {
    return (
        <ChartContainerSansLegend>
            <ResponsiveTreeMap<TreeData>
                tile="binary"
                data={data}
                identity="name"
                value="value"
                valueFormat={(d: number) => `${d.toLocaleString()} documents`}
                colors={(d: { data: TreeData }) => d.data.color}
                nodeOpacity={1}
                enableLabel={false}
                margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                parentLabelPosition="top"
                parentLabelTextColor={{
                    from: 'color',
                    modifiers: [['darker', 2]],
                }}
                borderColor={{
                    from: 'color',
                    modifiers: [['darker', 0.3]],
                }}
            />
        </ChartContainerSansLegend>
    );
};
