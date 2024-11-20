import { TuneOutlined } from '@mui/icons-material';

import { useAppContext } from '@/AppContext';
import { IconButtonWithTooltip } from '@/components/IconButtonWithTooltip';

import { PARAMETERS_DRAWER_ID } from '../parameter/ParameterDrawer';

export const ParameterIconButton = () => {
    const toggleDrawer = useAppContext((state) => state.toggleDrawer);

    const toggleParametersDrawer = () => {
        toggleDrawer(PARAMETERS_DRAWER_ID);
    };

    return (
        <IconButtonWithTooltip onClick={toggleParametersDrawer} label="Show parameters">
            <TuneOutlined />
        </IconButtonWithTooltip>
    );
};
