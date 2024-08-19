import ArticleIcon from '@mui/icons-material/Article';

import { useAppContext } from '@/AppContext';

import { ResponsiveButton } from '../ResponsiveButton';
import { ATTRIBUTION_DRAWER_ID } from './drawer/AttributionDrawer';

export const AttributionButton = () => {
    const toggleDrawer = useAppContext((state) => state.toggleDrawer);
    const toggleHistoryDrawer = () => {
        toggleDrawer(ATTRIBUTION_DRAWER_ID);
    };

    const isAttributionDrawerOpen = useAppContext(
        (state) => state.currentOpenDrawer === ATTRIBUTION_DRAWER_ID
    );

    return (
        <ResponsiveButton
            variant={isAttributionDrawerOpen ? 'contained' : 'outlined'}
            startIcon={<ArticleIcon />}
            title="Attribution"
            onClick={toggleHistoryDrawer}
        />
    );
};
