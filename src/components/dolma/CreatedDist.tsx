import { useState, useEffect } from 'react';
import { LinearProgress } from '@mui/material';

import { StaticDataClient } from '../../api/dolma/StaticDataClient';
import { staticData } from '../../api/dolma/staticData';
import { DistData, MapDistData, getDistAndMapDistData } from './sharedCharting';
import { DistChart } from './DistChart';

export const CreatedDist = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [sources, setSources] = useState<staticData.Sources>();
    const [distData, setDistData] = useState<DistData[]>([]);
    const [mapDistData, setMapDistData] = useState<MapDistData>({});

    const api = new StaticDataClient();

    useEffect(() => {
        setLoading(true);
        api.getSources().then((s) => {
            setSources(
                Object.fromEntries(
                    Object.entries(s).filter(([_k, v]) =>
                        v.staticData.includes(staticData.StaticDataType.Created)
                    )
                )
            );
            api.getCreated().then((created) => {
                const [chartDistData, chartMapDistData] = getDistAndMapDistData(
                    created,
                    (n: number) => n.toString()
                );
                setDistData(chartDistData);
                setMapDistData(chartMapDistData);
                setLoading(false);
            });
        });
    }, []);

    if (loading || !sources || !distData || !distData.length) {
        return <LinearProgress />;
    }

    return (
        <DistChart
            categoryLabel="Created"
            data={distData}
            mapData={mapDistData}
            sourceMap={sources}
        />
    );
};
