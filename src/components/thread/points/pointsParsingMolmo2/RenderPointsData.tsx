import { formatPointsData } from './formatPointsData';
import { PointsAttributes } from './pointsDataTypes';

export const RenderPointsData = (props: PointsAttributes) => {
    const pointsData = formatPointsData(props);
    return <code>{JSON.stringify(pointsData, null, 2)}</code>;
};
