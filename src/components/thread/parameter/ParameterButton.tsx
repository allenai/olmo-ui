import GearIcon from '@mui/icons-material/SettingsOutlined';

import { useAppContext } from '@/AppContext';

import { ResponsiveButton, ResponsiveButtonProps } from '../ResponsiveButton';
import { PARAMETERS_DRAWER_ID } from './ParameterDrawer';

type ParameterButtonProps = Partial<
    Pick<ResponsiveButtonProps, 'isResponsive' | 'variant' | 'layout'>
>;

export const ParameterButton = ({
    variant = 'outlined',
    isResponsive = true,
    layout = 'text',
}: ParameterButtonProps) => {
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
            variant={variant}
            isResponsive={isResponsive}
            layout={layout}
            startIcon={<GearIcon />}
            title="Parameters"
            onClick={toggleParametersDrawer}
            disabled={!canUseParameterButton}
        />
    );
};
