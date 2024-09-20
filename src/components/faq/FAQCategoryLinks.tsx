import { Card, CardContent, Link, Stack, Typography } from '@mui/material';

import { faqs } from '@/assets/faq-list';

import { useDesktopOrUp } from '../dolma/shared';
import { createFAQId } from './createFAQId';
import { FAQDrawer } from './FAQDrawer';

export const FAQCategoryLinks = (): JSX.Element => {
    const isDesktop = useDesktopOrUp();

    if (isDesktop) {
        return (
            <Card
                elevation={0}
                sx={{
                    backgroundColor: 'background.default',
                    padding: (theme) => theme.spacing(1),
                    gridArea: 'aside',
                }}>
                <CardContent>
                    <Typography variant="body1" fontWeight="bold" component="h2" marginBlockEnd={6}>
                        Categories
                    </Typography>
                    <Stack gap={3}>
                        {faqs.map((faqCategory) => (
                            <Link
                                sx={{ paddingTop: (theme) => theme.spacing(1) }}
                                href={'#' + createFAQId(faqCategory.category)}
                                key={faqCategory.category}
                                underline="always"
                                color="text.primary"
                                component="a">
                                {faqCategory.category}
                            </Link>
                        ))}
                    </Stack>
                </CardContent>
            </Card>
        );
    } else {
        return <FAQDrawer />;
    }
};
