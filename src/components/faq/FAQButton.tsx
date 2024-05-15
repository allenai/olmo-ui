import FilterListIcon from '@mui/icons-material/FilterList';
import { Button } from '@mui/material';

import { useAppContext } from '@/AppContext';

import { CATEGORY_DRAWER_ID } from './FAQDrawer';

export const FAQButton = () => {
    const toggleDrawer = useAppContext((state) => state.toggleDrawer);
    const toggleCategoryDrawer = () => {
        toggleDrawer(CATEGORY_DRAWER_ID);
    };

    return (
        <Button
            size="small"
            component="label"
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={toggleCategoryDrawer}>
            Categories
        </Button>
    );
};
