import CloseIcon from '@mui/icons-material/Close';
import { Divider, IconButton, List, ListItem, ListSubheader, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';

import { useAppContext } from '@/AppContext';
import { faqs } from '@/assets/faq-list';
import { FAQMarkdown } from '@/pages/FAQsPage';
import { DrawerId } from '@/slices/DrawerSlice';

import { ResponsiveDrawer } from '../ResponsiveDrawer';
import { FAQ } from './FAQ';
import { FAQCategory } from './FAQCategory';

export const CATEGORY_DRAWER_ID: DrawerId = 'category';

export const FAQDrawer = () => {
    const closeDrawer = useAppContext((state) => state.closeDrawer);
    const isDrawerOpen = useAppContext((state) => state.currentOpenDrawer === CATEGORY_DRAWER_ID);

    const handleDrawerClose = () => {
        closeDrawer(CATEGORY_DRAWER_ID);
    };

    return (
        <ResponsiveDrawer
            onClose={handleDrawerClose}
            open={isDrawerOpen}
            anchor="right"
            desktopDrawerVariant="persistent"
            heading={
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
                            onClick={handleDrawerClose}
                            sx={{ color: 'inherit' }}
                            data-testid="Close History Drawer">
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                    <Divider />
                </Box>
            }
            desktopDrawerSx={{ gridArea: 'side-drawer' }}>
            <Stack direction="column" sx={{ overflowY: 'scroll' }}>
                <List>
                    {faqs.map((faqCategory, index) => (
                        <>
                            <ListItem>
                                <FAQCategory
                                    categoryName={faqCategory.category}
                                    key={faqCategory.category}>
                                    {faqCategory.questions.map((question) => (
                                        <FAQ question={question.question} key={question.question}>
                                            <FAQMarkdown>{question.answer}</FAQMarkdown>
                                        </FAQ>
                                    ))}
                                </FAQCategory>
                            </ListItem>
                            {index !== faqs.length - 1 && <Divider />}
                        </>
                    ))}
                </List>
            </Stack>
        </ResponsiveDrawer>
    );
};
