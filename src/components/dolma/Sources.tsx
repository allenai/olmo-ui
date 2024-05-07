import { LinearProgress } from '@mui/material';
import { useEffect, useState } from 'react';

import { staticData } from '../../api/dolma/staticData';
import { StaticDataClient } from '../../api/dolma/StaticDataClient';
import { PieData, SourcesPieChart } from './SourcesPieChart';

export const Sources = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [sources, setSources] = useState<staticData.Sources>({});
    const [sourceData, setSourceData] = useState<PieData[]>([]);

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
                const newData: PieData[] = [];
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

    return <SourcesPieChart data={sourceData} sourceMap={sources} />;
};
