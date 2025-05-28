import {
    DesktopAttributionDrawer,
    MobileAttributionDrawer,
} from '@/components/thread/attribution/drawer/AttributionDrawer';
import {
    DesktopParameterDrawer,
    MobileParameterDrawer,
} from '@/components/thread/parameter/ParameterDrawer';

import { useDesktopOrUp } from './dolma/shared';

export const ResponsiveControlsDrawer = () => {
    const isDesktop = useDesktopOrUp();
    return isDesktop ? (
        <>
            <DesktopParameterDrawer />
            <DesktopAttributionDrawer />
        </>
    ) : (
        <>
            <MobileAttributionDrawer />
            <MobileParameterDrawer />
        </>
    );
};
