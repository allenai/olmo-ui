import { ReactNode } from 'react';

interface PointCircleProps {
    cx: number;
    cy: number;
}

export const PointCircle = ({ cx, cy }: PointCircleProps): ReactNode => {
    return (
        <circle
            cy={`${cy}%`}
            cx={`${cx}%`}
            r={'6'}
            stroke={'white'}
            strokeWidth={'1.5'}
            fill="currentColor"
        />
    );
};
