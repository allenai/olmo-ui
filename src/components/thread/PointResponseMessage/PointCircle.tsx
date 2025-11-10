import { ReactNode } from 'react';

interface PointCircleProps {
    xPercent: number;
    yPercent: number;
    shouldAnimate?: boolean;
}

export const PointCircle = ({
    xPercent,
    yPercent,
    shouldAnimate = false,
}: PointCircleProps): ReactNode => {
    return (
        <>
            <circle cx={`${xPercent}%`} cy={`${yPercent}%`} r={5} fill="currentColor" />
            {shouldAnimate && (
                <circle
                    cx={`${xPercent}%`}
                    cy={`${yPercent}%`}
                    fill="none"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="1.5">
                    <animate
                        attributeName="r"
                        from="4"
                        to="8"
                        dur="1.5s"
                        begin="0s"
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="opacity"
                        from="1"
                        to="0"
                        dur="1.5s"
                        begin="0s"
                        repeatCount="indefinite"
                    />
                </circle>
            )}
        </>
    );
};
