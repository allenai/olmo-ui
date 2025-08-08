import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import { useLocation } from 'react-router-dom';

import { useAppContext } from '@/AppContext';
import { IconButtonWithTooltip } from '@/components/IconButtonWithTooltip';

import { ATTRIBUTION_DRAWER_ID } from '../attribution/drawer/AttributionDrawer';

export const CorpusLinkIconButton = () => {
    const toggleDrawer = useAppContext((state) => state.toggleDrawer);
    const location = useLocation();
    const isOnComparisonPage = location.pathname.startsWith('/comparison');

    const toggleParametersDrawer = () => {
        toggleDrawer(ATTRIBUTION_DRAWER_ID);
    };

    const isActive = useAppContext((state) => state.currentOpenDrawer === ATTRIBUTION_DRAWER_ID);

    return (
        <IconButtonWithTooltip
            desktopPlacement="left"
            onClick={isOnComparisonPage ? () => {} : toggleParametersDrawer}
            label="OLMoTrace documents"
            isActive={isActive}
            disabled={isOnComparisonPage}>
            <ArticleOutlined />
        </IconButtonWithTooltip>
    );
};
