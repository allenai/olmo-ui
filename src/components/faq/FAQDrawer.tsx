import CloseIcon from '@mui/icons-material/Close';
import { Divider, IconButton, ListSubheader, Typography } from '@mui/material';
import { Stack } from '@mui/system';

import { DrawerId } from '@/slices/DrawerSlice';

import { FullScreenDrawer, FullScreenDrawerHeader } from '../TemporaryDrawer';
import { FAQCategorySection } from './FAQCategorySection';

export const CATEGORY_DRAWER_ID: DrawerId = 'category';

export const FAQCategoriesDrawer = () => {
    return (
        <FullScreenDrawer
            drawerId="category"
            fullWidth
            header={({ onDrawerClose }) => (
                <FullScreenDrawerHeader>
                    <Stack
                        justifyContent="space-between"
                        direction="row"
                        gap={2}
                        alignItems="center">
                        <ListSubheader sx={{ paddingBlock: 2, backgroundColor: 'transparent' }}>
                            <Typography variant="h5" margin={0} color="primary">
                                Categories
                            </Typography>
                        </ListSubheader>
                        <IconButton
                            onClick={onDrawerClose}
                            sx={{ color: 'inherit' }}
                            data-testid="Close Categories Drawer">
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                    <Divider />
                </FullScreenDrawerHeader>
            )}>
            <FAQCategorySection />
        </FullScreenDrawer>
    );
};
