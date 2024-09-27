import FilterListIcon from '@mui/icons-material/FilterList';
import { Button } from '@mui/material';

import { useAppContext } from '@/AppContext';

import { CATEGORY_DRAWER_ID } from './FAQDrawer';

export const FAQButton = () => {
    const openDrawer = useAppContext((state) => state.openDrawer);
    const openCategoryDrawer = () => {
        openDrawer(CATEGORY_DRAWER_ID);
    };

    return (
        <Button
            size="small"
            component="label"
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={openCategoryDrawer}>
            Categories
        </Button>
    );
};
