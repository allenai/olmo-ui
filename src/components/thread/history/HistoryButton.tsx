import HistoryIcon from '@mui/icons-material/History';

import { useAppContext } from '@/AppContext';
import { ResponsiveButton } from '../ResponsiveButton';
import { HISTORY_DRAWER_ID } from './HistoryDrawer';

export const HistoryButton = () => {
    const toggleDrawer = useAppContext((state) => state.toggleDrawer);
    const toggleHistoryDrawer = () => {
        toggleDrawer(HISTORY_DRAWER_ID);
    };

    const isHistoryDrawerOpen = useAppContext(
        (state) => state.currentOpenDrawer === HISTORY_DRAWER_ID
    );

    return (
        <ResponsiveButton
            variant={isHistoryDrawerOpen ? 'contained' : 'outlined'}
            color="secondary"
            startIcon={<HistoryIcon />}
            title="History"
            onClick={toggleHistoryDrawer}
        />
    );
};
