import CloseIcon from '@mui/icons-material/Close';
import { Divider, IconButton, ListSubheader, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';

import { useAppContext } from '@/AppContext';
import { DrawerId } from '@/slices/DrawerSlice';

import { TemporaryDrawer } from '../TemporaryDrawer';
import { FAQCategorySection } from './FAQCategorySection';

export const CATEGORY_DRAWER_ID: DrawerId = 'category';

export const FAQDrawer = () => {
    const closeDrawer = useAppContext((state) => state.closeDrawer);

    return (
        <TemporaryDrawer
            drawerId="category"
            header={({ onDrawerClose }) => (
                <Box
                    sx={{
                        position: 'sticky',
                        top: 0,
                        backgroundColor: 'inherit',
                    }}>
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
                </Box>
            )}>
            <FAQCategorySection />
        </TemporaryDrawer>
    );
};
