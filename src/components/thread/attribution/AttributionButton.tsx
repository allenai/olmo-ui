import ArticleIcon from '@mui/icons-material/Article';

import { useAppContext } from '@/AppContext';

import { ResponsiveButton } from '../ResponsiveButton';
import { ATTRIBUTION_DRAWER_ID } from './drawer/AttributionDrawer';

export const AttributionButton = () => {
    const toggleDrawer = useAppContext((state) => state.toggleDrawer);
    const toggleAttributionDrawer = () => {
        toggleDrawer(ATTRIBUTION_DRAWER_ID);
    };

    return (
        <ResponsiveButton
            variant="outlined"
            isResponsive={false}
            layout="text"
            startIcon={<ArticleIcon />}
            title="CorpusLink"
            onClick={toggleAttributionDrawer}
        />
    );
};
