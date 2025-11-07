import { PlayerRef } from '@remotion/player';
import { ReactNode, useState } from 'react';

import { VideoFramePoints } from './example';
import { FPS } from './molmo-video';
import { useCurrentPlayerFrame } from './use-current-player-frame';

export const PointSelect: React.FC<{
    playerRef: React.RefObject<PlayerRef | null>;
    children: ReactNode;
}> = ({ playerRef, children }) => {
    const frame = useCurrentPlayerFrame(playerRef);
    const [points, setPoints] = useState<VideoFramePoints[]>([]);

    const setPoint = (event: React.MouseEvent) => {
        const target = event.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();

        // Get percentage x, y based on the parent frame
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        // Create VideoFramePoints based on the current frame
        const timestamp = frame / FPS;
        const newFramePoint: VideoFramePoints = {
            frameTimestamp: timestamp,
            points: [
                {
                    objectId: `point-${Date.now()}`,
                    x,
                    y,
                },
            ],
        };

        // Add it to points
        const updatedPoints = [...points, newFramePoint];
        setPoints(updatedPoints);

        // Console log points
        console.log(updatedPoints);
    };

    return <span onClick={setPoint}>{children}</span>;
};
