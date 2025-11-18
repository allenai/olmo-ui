import { css } from '@allenai/varnish-panda-runtime/css';
import { useMemo } from 'react';

import { VideoTrackingPoints } from '@/components/thread/points/pointsDataTypes';

const TRACKING_DOT_SIZE = 10;
export const TrackingDotsTimeLine = ({
    data,
    durationInFrames,
    fps,
}: {
    data: VideoTrackingPoints;
    durationInFrames: number;
    fps: number;
}) => {
    const dots = useMemo(() => {
        return data.frameList.map((frame) => {
            return (frame.timestamp / (durationInFrames / fps)) * 100;
        });
    }, [data, durationInFrames, fps]);

    return (
        <>
            {dots.map((leftOffset, index) => {
                return (
                    <div
                        key={index}
                        className={css({
                            position: 'absolute',
                            width: `[${TRACKING_DOT_SIZE}px]`,
                            height: `[${TRACKING_DOT_SIZE}px]`,
                            borderRadius: 'full',
                            backgroundColor: 'pink.100',
                            top: '2',
                        })}
                        style={{ left: `calc(${leftOffset}% - ${TRACKING_DOT_SIZE / 2}px)` }}
                    />
                );
            })}
        </>
    );
};
