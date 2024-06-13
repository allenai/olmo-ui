import { LinearProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { staticData } from '../../api/dolma/staticData';
import { StaticDataClient } from '../../api/dolma/StaticDataClient';
import { ResponsiveCard } from '../ResponsiveCard';
import { BarData, SourcesBarChart } from './SourcesBarChart';

export const SourcesForBarChart = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [sources, setSources] = useState<staticData.Sources>({});
    const [sourceData, setSourceData] = useState<BarData[]>([]);

    const api = new StaticDataClient();

    useEffect(() => {
        setLoading(true);
        api.getSources().then((s) => {
            const newSources = Object.fromEntries(
                Object.entries(s).filter(([_k, v]) =>
                    v.staticData.includes(staticData.StaticDataType.SourceCounts)
                )
            );
            setSources(newSources);
            api.getSourceCounts().then((data) => {
                const newData: BarData[] = [];
                Object.entries(data).forEach(([k, v]) => {
                    if (newSources[k]) {
                        newData.push({
                            id: k,
                            label: newSources[k].label,
                            value: v,
                            color: newSources[k].color,
                        });
                    }
                });
                setSourceData(newData);
                setLoading(false);
            });
        });
    }, []);

    if (loading || !sources) {
        return <LinearProgress />;
    }

    return (
        <ResponsiveCard>
            <>
                <Typography variant="h3">Sources</Typography>
                <SourcesBarChart data={sourceData} sourceMap={sources} />
            </>
        </ResponsiveCard>
    );
};
