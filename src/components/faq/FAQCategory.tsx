import { Box, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

import type { FAQ as FAQType } from '@/assets/faq-list';

import { createFAQId } from './createFAQId';
import { FAQ } from './FAQ';

const FAQ_GAP = 1;

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
            gap={FAQ_GAP}
            className="faq-category"
            sx={{
                '&+&': {
                    borderBlockStart: (theme) => `1px solid ${theme.palette.divider}`,
                    paddingBlockStart: FAQ_GAP,
                },
            }}>
            <Typography variant="h5" component="h2">
                {categoryName}
            </Typography>
            <Stack direction="column" gap={2}>
                {questions.map((question) => (
                    <FAQ
                        question={question.question}
                        answer={question.answer}
                        key={categoryName + question.question}
                    />
                ))}
            </Stack>
        </Stack>
    );
};
