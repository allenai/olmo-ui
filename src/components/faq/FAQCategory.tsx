import { Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

import type { FAQ as FAQType } from '@/components/faq/faq-list';

import { FAQ } from './FAQ';
import { createFAQId } from './faq-utils';

interface FAQCategoryProps {
    categoryName: string;
    questions: FAQType[];
}

export const FAQCategory = ({ categoryName, questions }: FAQCategoryProps): ReactNode => {
    if (questions.length === 0) {
        return null;
    }

    return (
        <Stack
            id={createFAQId(categoryName)}
            direction="column"
            gap={2}
            className="faq-category"
            sx={{
                '&+&': {
                    borderBlockStart: (theme) => `1px solid ${theme.color.N6}`,
                    paddingBlockStart: 3.5,
                },
            }}>
            <Typography variant="h5" component="h2">
                {categoryName}
            </Typography>
            <Stack direction="column" gap={0}>
                {questions.map((question) => {
                    const answer: string =
                        typeof question.answer === 'string' ? question.answer : question.answer();
                    return (
                        <FAQ
                            question={question.question}
                            answer={answer}
                            key={categoryName + question.question}
                        />
                    );
                })}
            </Stack>
        </Stack>
    );
};
