import { Card, CardContent, Link, Stack, Typography } from '@mui/material';

import { corpusLinkFaqs, faqs } from '@/components/faq/faq-list';
import { useFeatureToggles } from '@/FeatureToggleContext';

import { useDesktopOrUp } from '../dolma/shared';
import { createFAQId } from './faq-utils';
import { FAQCategoriesDrawer } from './FAQDrawer';

export const FAQCategoryLinks = (): JSX.Element => {
    const { isCorpusLinkEnabled } = useFeatureToggles();
    const isDesktop = useDesktopOrUp();
    const allFaqs = isCorpusLinkEnabled ? faqs.concat(corpusLinkFaqs) : faqs;
    if (isDesktop) {
        return (
            <Card
                elevation={0}
                sx={{
                    backgroundColor: 'background.default',
                    padding: (theme) => theme.spacing(1),
                    gridArea: 'aside',
                    width: '20rem',
                }}>
                <CardContent>
                    <Typography variant="body1" fontWeight="bold" component="h2" marginBlockEnd={6}>
                        Categories
                    </Typography>
                    <Stack gap={3}>
                        {allFaqs.map((faqCategory) => (
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
        return <FAQCategoriesDrawer />;
    }
};
