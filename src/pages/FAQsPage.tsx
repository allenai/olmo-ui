import { Box, Card, CardContent, Stack } from '@mui/material';

import { useDesktopOrUp } from '@/components/dolma/shared';
import { corpusLinkFaqs, faqs } from '@/components/faq/faq-list';
import { FAQCategoriesButton } from '@/components/faq/FAQCategoriesButton';
import { FAQCategory } from '@/components/faq/FAQCategory';
import { FAQCategoryLinks } from '@/components/faq/FAQCategoryLinks';
import { MetaTags } from '@/components/MetaTags';
import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';
import { useFeatureToggles } from '@/FeatureToggleContext';

export const FAQsPage = (): JSX.Element => {
    const { isCorpusLinkEnabled } = useFeatureToggles();

    const isDesktop = useDesktopOrUp();
    const allFaqs = isCorpusLinkEnabled ? faqs.concat(corpusLinkFaqs) : faqs;
    return (
        <>
            <MetaTags />
            <Card
                elevation={0}
                sx={{
                    gridArea: 'content',
                    overflow: 'auto',
                    paddingInline: 2,
                }}>
                <CardContent
                    sx={(theme) => ({
                        backgroundColor: 'background.default',
                        paddingInline: 2,
                        [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
                            paddingInline: 4,
                        },
                    })}
                    component={Stack}
                    gap={3.5}>
                    {!isDesktop && <FAQCategoriesButton />}
                    {allFaqs.map((faqCategory) => (
                        <FAQCategory
                            categoryName={faqCategory.category}
                            questions={faqCategory.questions}
                            key={faqCategory.category}
                        />
                    ))}
                    {/* Fade effect */}
                    <Box
                        sx={{
                            bottom: '-1px',
                            minHeight: (theme) => theme.spacing(6),
                            position: 'sticky',
                            background: (theme) =>
                                `linear-gradient(0deg, ${theme.palette.background.default} 0%, #0000 42.5%)`,
                            marginTop: (theme) => theme.spacing(-3),
                        }}
                    />
                </CardContent>
            </Card>
            <FAQCategoryLinks />
        </>
    );
};
