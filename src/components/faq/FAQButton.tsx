import FilterListIcon from '@mui/icons-material/FilterList';

import { useAppContext } from '@/AppContext';

import { ResponsiveButton } from '../thread/ResponsiveButton';
import { CATEGORY_DRAWER_ID } from './FAQDrawer';

export const FAQButton = () => {
    const toggleDrawer = useAppContext((state) => state.toggleDrawer);
    const toggleCategoryDrawer = () => {
        toggleDrawer(CATEGORY_DRAWER_ID);
    };

    const isCategoryDrawerOpen = useAppContext(
        (state) => state.currentOpenDrawer === CATEGORY_DRAWER_ID
    );

    return (
        <ResponsiveButton
            variant={isCategoryDrawerOpen ? 'contained' : 'outlined'}
            color="secondary"
            startIcon={<FilterListIcon />}
            title="Categories"
            onClick={toggleCategoryDrawer}
        />
    );
};
