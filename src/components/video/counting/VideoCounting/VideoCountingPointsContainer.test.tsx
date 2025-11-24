import { render } from '@test-utils';
import { useCurrentFrame, useVideoConfig, VideoConfig } from 'remotion';

import type { VideoFramePoints } from '@/components/thread/points/pointsDataTypes';

import { VideoCountingPointsContainer } from './VideoCountingPointsContainer';

vi.mock('remotion', () => ({
    useCurrentFrame: vi.fn(),
    useVideoConfig: vi.fn(),
}));

const mockUseCurrentFrame = vi.mocked(useCurrentFrame);
const mockUseVideoConfig = vi.mocked(useVideoConfig);

const mockVideoConfig = {
    fps: 30,
    width: 1920,
    height: 1080,
    durationInFrames: 300,
    id: 'test',
    defaultProps: {},
    props: {},
    defaultCodec: null,
    defaultOutName: null,
    defaultVideoImageFormat: null,
    defaultPixelFormat: null,
    defaultProResProfile: null,
} satisfies VideoConfig;

describe('VideoCountingPointsContainer', () => {
    beforeEach(() => {
        mockUseVideoConfig.mockReturnValue(mockVideoConfig);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('handles empty frameList', () => {
        mockUseCurrentFrame.mockReturnValue(60); // 30fps = 2seconds

        const videoPoints = {
            label: 'test',
            type: 'frame-points',
            frameList: [],
        } satisfies VideoFramePoints;

        const { container } = render(<VideoCountingPointsContainer videoPoints={videoPoints} />);

        const svgs = container.querySelectorAll('svg');
        expect(svgs).toHaveLength(0);
    });

    it('renders single frame', () => {
        mockUseCurrentFrame.mockReturnValue(60); // 30fps = 2seconds

        const videoPoints = {
            label: 'test',
            type: 'frame-points',
            frameList: [
                {
                    timestamp: 2.0,
                    points: [{ pointId: '1', x: 10, y: 20 }],
                },
            ],
        } satisfies VideoFramePoints;

        const { container } = render(<VideoCountingPointsContainer videoPoints={videoPoints} />);

        const svgs = container.querySelectorAll('svg');
        expect(svgs.length).toBe(1);
    });

    describe('point visiblity on frames', () => {
        const videoPoints = {
            label: 'test',
            type: 'frame-points',
            frameList: [
                { timestamp: 1.0, points: [{ pointId: '1', x: 10, y: 20 }] },
                { timestamp: 2.0, points: [{ pointId: '2', x: 30, y: 40 }] },
            ],
        } satisfies VideoFramePoints;

        // between / around frames with points
        it.each([15, 45, 90])('does not render on frame %i', (frame) => {
            mockUseCurrentFrame.mockReturnValue(frame);
            const { container } = render(
                <VideoCountingPointsContainer videoPoints={videoPoints} />
            );
            const svg = container.querySelector('svg');
            expect(svg).not.toBeInTheDocument();
        });

        // frames with points
        it.each([30, 60])('does render on frame %i', (frame) => {
            mockUseCurrentFrame.mockReturnValue(frame);
            const { container } = render(
                <VideoCountingPointsContainer videoPoints={videoPoints} />
            );
            const svg = container.querySelector('svg');
            expect(svg).toBeInTheDocument();
        });
    });
});
