import FilterListIcon from '@mui/icons-material/FilterList';
import { Button } from '@mui/material';

import { useAppContext } from '@/AppContext';

import { CATEGORY_DRAWER_ID } from './FAQDrawer';

export const FAQCategoriesButton = () => {
    const openDrawer = useAppContext((state) => state.openDrawer);
    const openCategoryDrawer = () => {
        openDrawer(CATEGORY_DRAWER_ID);
    };

    return (
        <Button
            variant="outlined"
            color="inherit"
            startIcon={<FilterListIcon />}
            onClick={openCategoryDrawer}
            sx={{
                alignSelf: 'flex-start',
                marginTop: -2,
            }}>
            Categories
        </Button>
    );
};
