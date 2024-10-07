import { LinearProgress } from '@mui/material';
import { useLoaderData, useNavigation } from 'react-router-dom';

import { DistChart } from './DistChart';
import { DolmaResponse } from './DolmaTabs';

export const WordDist = () => {
    const { distData, mapDistData, sources } = (useLoaderData() as DolmaResponse)
        .documentLengthData;

    const navigation = useNavigation();

    const isLoading = navigation.state === 'loading';

    if (isLoading || !distData || !distData.length) {
        return <LinearProgress />;
    }

    return (
        <DistChart
            categoryLabel="Characters per Document"
            data={distData}
            mapData={mapDistData}
            sourceMap={sources}
        />
    );
};
