import ArticleOutlined from '@mui/icons-material/ArticleOutlined';

import { useAppContext } from '@/AppContext';
import { IconButtonWithTooltip } from '@/components/IconButtonWithTooltip';

import { ATTRIBUTION_DRAWER_ID } from '../attribution/drawer/AttributionDrawer';

export const CorpusLinkIconButton = () => {
    const toggleDrawer = useAppContext((state) => state.toggleDrawer);

    const toggleParametersDrawer = () => {
        toggleDrawer(ATTRIBUTION_DRAWER_ID);
    };

    const isActive = useAppContext((state) => state.currentOpenDrawer === ATTRIBUTION_DRAWER_ID);

    return (
        <IconButtonWithTooltip
            desktopPlacement="left"
            onClick={toggleParametersDrawer}
            label="OLMoTrace documents"
            isActive={isActive}>
            <ArticleOutlined />
        </IconButtonWithTooltip>
    );
};
