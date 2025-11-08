import { PropsWithChildren } from 'react';

import { formatPointsData } from './formatPointsData';
import { PointsAttributes } from './pointsDataTypes';

type RenderPointsDataProps = PropsWithChildren<PointsAttributes>;

export const RenderPointsData = (props: RenderPointsDataProps) => {
    const pointsData = { ...formatPointsData(props), label: props.children };
    return <code>{JSON.stringify(pointsData, null, 2)}</code>;
};
