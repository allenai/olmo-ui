import { Button, Link, Stack, TextField, Typography } from '@mui/material';
import { ComponentProps, useEffect, useMemo } from 'react';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import Markdown from 'react-markdown';
import { Form, useSearchParams } from 'react-router-dom';

import { faqs } from '@/assets/faq-list';
import { PageContentWrapper } from '@/components/dolma/PageContentWrapper';
import { FAQ } from '@/components/faq/FAQ';
import { FAQCategory } from '@/components/faq/FAQCategory';

const markdownComponents: ComponentProps<typeof Markdown>['components'] = {
    p: ({ children }) => <Typography variant="body1">{children}</Typography>,
    // The ref types don't match for some reason
    a: ({ ref, ...props }) => <Link {...props} target="_blank" />,
};
const FAQMarkdown = ({ children }: { children: string }) => {
    return <Markdown components={markdownComponents}>{children}</Markdown>;
};

const SEARCH_FIELD_NAME = 'search';

export const FAQsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
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
                (question) => question.answer.includes(search) || question.question.includes(search)
            ),
        }));

        return filtered;
    }, [search]);

    return (
        <PageContentWrapper>
            <Form>
                <Stack direction="row" gap={2} marginBlockEnd={3}>
                    <TextField
                        type="search"
                        label="Search FAQs"
                        name={SEARCH_FIELD_NAME}
                        fullWidth
                        defaultValue={search}
                        size="small"
                    />
                    <Button type="submit" variant="contained">
                        Search
                    </Button>
                </Stack>
            </Form>
            {filteredFAQs.map((faqCategory) => (
                <FAQCategory categoryName={faqCategory.category} key={faqCategory.category}>
                    {faqCategory.questions.map((question) => (
                        <FAQ question={question.question} key={question.question}>
                            <FAQMarkdown>{question.answer}</FAQMarkdown>
                        </FAQ>
                    ))}
                </FAQCategory>
            ))}
        </PageContentWrapper>
    );
};
