import { Button, Card, CardContent, Stack, TextField } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { Form, useSearchParams } from 'react-router-dom';

import { faqs } from '@/assets/faq-list';
import { useDesktopOrUp } from '@/components/dolma/shared';
import { FAQButton } from '@/components/faq/FAQButton';
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
            questions: category.questions.filter(
                (question) => question.question.includes(search) || question.answer.includes(search)
            ),
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
                <CardContent sx={{ paddingInline: 2 }} component={Stack} gap={2}>
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
                            <Button type="submit" variant="contained" color="inherit">
                                Search
                            </Button>
                        </Stack>
                    </Form>
                    {!isDesktop && <FAQButton />}
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
                </CardContent>
            </Card>
            <FAQCategoryLinks />
        </>
    );
};
