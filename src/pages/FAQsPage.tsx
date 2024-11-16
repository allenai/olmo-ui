import { Box, Button, Card, CardContent, Stack, TextField } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { Form, useSearchParams } from 'react-router-dom';

import { useDesktopOrUp } from '@/components/dolma/shared';
import { faqs } from '@/components/faq/faq-list';
import { FAQCategoriesButton } from '@/components/faq/FAQCategoriesButton';
import { FAQCategory } from '@/components/faq/FAQCategory';
import { FAQCategoryLinks } from '@/components/faq/FAQCategoryLinks';
import { MetaTags } from '@/components/MetaTags';
import { NoResults } from '@/components/NoResults';

const SEARCH_FIELD_NAME = 'search';

export const FAQsPage = (): JSX.Element => {
    const [searchParams, setSearchParams] = useSearchParams();
    const isDesktop = useDesktopOrUp();
    const search = searchParams.get(SEARCH_FIELD_NAME);

    useEffect(() => {
        // This makes the ?search= part of the URL go away if there's an empty query
        if (!search) {
            setSearchParams((searchParams) => {
                searchParams.delete('search');
                return searchParams;
            });
        }
    }, [search, setSearchParams]);

    const filteredFAQs = useMemo(() => {
        if (!search) {
            return faqs;
        }

        const filtered = faqs.map((category) => ({
            category: category.category,
            questions: category.questions.filter((question) => {
                if (question.question.includes(search)) {
                    return true;
                }

                const faqAnswer =
                    typeof question.answer === 'string' ? question.answer : question.answer();

                return faqAnswer.includes(search);
            }),
        }));

        return filtered;
    }, [search]);

    const hasNoQuestionsToDisplay = filteredFAQs.every(
        (category) => category.questions.length === 0
    );

    return (
        <>
            <MetaTags title="Ai2 Playground" />
            <Card
                elevation={0}
                sx={{
                    gridArea: 'content',
                    overflow: 'auto',
                    backgroundColor: 'background.default',
                }}>
                <CardContent
                    sx={() => (isDesktop ? { paddingX: 4 } : { paddingInline: 2 })}
                    component={Stack}
                    gap={3.5}>
                    <Form>
                        <Stack direction="row" gap={2}>
                            <TextField
                                type="search"
                                label="Search FAQs"
                                name={SEARCH_FIELD_NAME}
                                fullWidth
                                defaultValue={search}
                                size="small"
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    backgroundColor: (theme) => theme.palette.background.reversed,
                                    color: (theme) => theme.palette.secondary.main,
                                    '&:hover': {
                                        backgroundColor: (theme) => theme.color['teal-100'].hex,
                                    },
                                }}>
                                Submit
                            </Button>
                        </Stack>
                    </Form>
                    {!isDesktop && <FAQCategoriesButton />}
                    {hasNoQuestionsToDisplay && search != null ? (
                        <NoResults request={search} resultsType="FAQ" />
                    ) : (
                        filteredFAQs.map((faqCategory) => (
                            <FAQCategory
                                categoryName={faqCategory.category}
                                questions={faqCategory.questions}
                                key={faqCategory.category}
                            />
                        ))
                    )}
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
