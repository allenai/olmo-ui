import { Button, Link, Stack, TextField, Typography } from '@mui/material';
import { useMemo } from 'react';
import Markdown from 'react-markdown';
import { Form, useSearchParams } from 'react-router-dom';

import { faqs } from '@/assets/faq-list';
import { PageContentWrapper } from '@/components/dolma/PageContentWrapper';
import { FAQ } from '@/components/faq/FAQ';
import { FAQCategory } from '@/components/faq/FAQCategory';
import { links } from '@/Links';

const FAQMarkdown = ({ children }: { children: string }) => {
    return (
        <Markdown
            components={{
                p: ({ children }) => <Typography variant="body1">{children}</Typography>,
                // The ref types don't match for some reason
                a: ({ ref, ...props }) => <Link {...props} target="_blank" />,
            }}>
            {children}
        </Markdown>
    );
};

const SEARCH_FIELD_NAME = 'search';

export const FAQsPage = () => {
    const [searchParams] = useSearchParams();
    const search = searchParams.get(SEARCH_FIELD_NAME);

    const filteredFAQs = useMemo(() => {
        if (search == null) {
            return faqs;
        }

        return faqs.map((category) => ({
            category: category.category,
            questions: category.questions.filter(
                (question) => question.answer.includes(search) || question.question.includes(search)
            ),
        }));
    }, [search]);

    return (
        <PageContentWrapper>
            <Form action={links.faqs}>
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
