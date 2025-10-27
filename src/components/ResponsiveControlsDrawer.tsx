import {
    DesktopAttributionDrawer,
    MobileAttributionDrawer,
} from '@/components/thread/attribution/drawer/AttributionDrawer';
import {
    DesktopParameterDrawer,
    MobileParameterDrawer,
} from '@/components/thread/parameter/ParameterDrawer';
import { ThreadParameterContent } from '@/components/thread/parameter/ThreadParameterContent';

import { useDesktopOrUp } from './dolma/shared';

export const ResponsiveControlsDrawer = () => {
    const isDesktop = useDesktopOrUp();
    return isDesktop ? (
        <>
            <DesktopParameterDrawer>
                <ThreadParameterContent />
            </DesktopParameterDrawer>
            <DesktopAttributionDrawer />
        </>
    ) : (
        <>
            <MobileParameterDrawer>
                <ThreadParameterContent />
            </MobileParameterDrawer>
            <MobileAttributionDrawer />
        </>
    );
};
