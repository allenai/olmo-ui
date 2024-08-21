import { useAppContext } from '@/AppContext';

describe('ThreadDisplay', () => {
    it('should highlight spans that contain special markdown characters', () => {
        vi.mock('../../AppContext.ts', () => ({
            useAppContext: (selector: any) => {
                const data = create;
            },
        }));
    });
});
