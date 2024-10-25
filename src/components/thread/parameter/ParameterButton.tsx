import GearIcon from '@mui/icons-material/SettingsOutlined';

import { useAppContext } from '@/AppContext';

import { ResponsiveButton } from '../ResponsiveButton';
import { PARAMETERS_DRAWER_ID } from './ParameterDrawer';

export const ParameterButton = () => {
    const toggleDrawer = useAppContext((state) => state.toggleDrawer);
    const canUseParameterButton = useAppContext(
        (state) =>
            state.selectedThreadRootId === '' ||
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            state.selectedThreadMessagesById[state.selectedThreadRootId]?.creator ===
                state.userInfo?.client
    );
    const toggleParametersDrawer = () => {
        toggleDrawer(PARAMETERS_DRAWER_ID);
    };
    return (
        <ResponsiveButton
            variant="outlined"
            isResponsive={false}
            layout="text"
            startIcon={<GearIcon />}
            title="Parameters"
            onClick={toggleParametersDrawer}
            disabled={!canUseParameterButton}
        />
    );
};
