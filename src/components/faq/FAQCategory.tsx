import { Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

import type { FAQ as FAQType } from '@/assets/faq-list';

import { createFAQId } from './createFAQId';
import { FAQ } from './FAQ';

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
                {questions.map((question) => (
                    <FAQ
                        question={question.question}
                        answer={question.answer}
                        linkId={question.interlinkId}
                        key={categoryName + question.question}
                    />
                ))}
            </Stack>
        </Stack>
    );
};
