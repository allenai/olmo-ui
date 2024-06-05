import GearIcon from '@mui/icons-material/SettingsOutlined';

import { useAppContext } from '@/AppContext';

import { ResponsiveButton } from '../ResponsiveButton';
import { PARAMETERS_DRAWER_ID } from './ParameterDrawer';

export const ParameterButton = () => {
    const toggleDrawer = useAppContext((state) => state.toggleDrawer);
    const canUseParameterButton = useAppContext((state) =>
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        state.selectedThreadMessagesById[state.selectedThreadRootId]
            ? state.selectedThreadMessagesById[state.selectedThreadRootId].creator ===
              state.userInfo?.client
            : true
    );
    const toggleParametersDrawer = () => {
        toggleDrawer(PARAMETERS_DRAWER_ID);
    };

    const isParametersDrawerOpen = useAppContext(
        (state) => state.currentOpenDrawer === PARAMETERS_DRAWER_ID
    );

    return (
        <ResponsiveButton
            variant={isParametersDrawerOpen ? 'contained' : 'outlined'}
            startIcon={<GearIcon />}
            title="Parameter"
            onClick={toggleParametersDrawer}
            disabled={!canUseParameterButton}
        />
    );
};
