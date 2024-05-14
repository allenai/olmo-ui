import { Box, Typography } from '@mui/material';

import type { FAQ as FAQType } from '@/assets/faq-list';

import { createFAQId } from './createFAQId';
import { FAQ } from './FAQ';

interface FAQCategoryProps {
    categoryName: string;
    questions: FAQType[];
}

export const FAQCategory = ({ categoryName, questions }: FAQCategoryProps): JSX.Element => {
    if (questions.length === 0) {
        return null;
    }

    return (
        <Box
            id={createFAQId(categoryName)}
            className="faq-category"
            sx={{
                ':not(:last-of-type)': {
                    marginBlockEnd: 2,
                },
                '&+&': {
                    borderBlockStart: (theme) => `1px solid ${theme.palette.divider}`,
                    paddingBlockStart: 2,
                },
            }}>
            <Typography variant="h5" component="h2" margin={0} marginBlockEnd={1}>
                {categoryName}
            </Typography>
            {questions.map((question) => (
                <FAQ
                    question={question.question}
                    answer={question.answer}
                    key={categoryName + question.question}
                />
            ))}
        </Box>
    );
};
