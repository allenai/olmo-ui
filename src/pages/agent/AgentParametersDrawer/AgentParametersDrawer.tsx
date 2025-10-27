import { useDesktopOrUp } from '@/components/dolma/shared';
import {
    DesktopParameterDrawer,
    MobileParameterDrawer,
} from '@/components/thread/parameter/ParameterDrawer';

import { AgentParameterContent } from './AgentParameterContent';

export const AgentParametersDrawer = () => {
    const isDesktop = useDesktopOrUp();
    return isDesktop ? (
        <DesktopParameterDrawer>
            <AgentParameterContent />
        </DesktopParameterDrawer>
    ) : (
        <MobileParameterDrawer>
            <AgentParameterContent />
        </MobileParameterDrawer>
    );
};
