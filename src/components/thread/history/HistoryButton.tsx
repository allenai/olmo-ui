import HistoryIcon from '@mui/icons-material/History';

import { useAppContext } from '../../../AppContext';
import { ResponsiveButton } from '../ResponsiveButton';
import { HistoryDrawerId } from './HistoryDrawer';

export const HistoryButton = () => {
    const toggleDrawer = useAppContext((state) => state.toggleDrawer);
    const toggleHistoryDrawer = () => toggleDrawer(HistoryDrawerId);

    const isHistoryDrawerOpen = useAppContext((state) => state.currentOpenDrawer === 'history');

    return (
        <ResponsiveButton
            variant={isHistoryDrawerOpen ? 'contained' : 'outlined'}
            startIcon={<HistoryIcon />}
            title="History"
            onClick={toggleHistoryDrawer}
        />
    );
};
