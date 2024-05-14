import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';

import { createFAQId } from './createFAQId';

interface FAQProps extends PropsWithChildren {
    question: string;
}

export const FAQ = ({ question, children }: FAQProps) => {
    const location = useLocation();
    const faqId = createFAQId(question);
    const faqContentId = faqId + '-content';

    const isLinkedFAQ = location.hash === `#${faqId}`;

    return (
        <Accordion
            elevation={0}
            square
            sx={{
                '&::before': {
                    display: 'none',
                },
            }}
            defaultExpanded={isLinkedFAQ}
            role="region"
            aria-labelledby={faqId}>
            <Typography variant="body1" fontWeight="bold" component="h3">
                <AccordionSummary
                    id={faqId}
                    expandIcon={<ExpandMore />}
                    aria-controls={faqContentId}>
                    {question}
                </AccordionSummary>
            </Typography>
            <AccordionDetails id={faqContentId}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {children}
                </Typography>
            </AccordionDetails>
        </Accordion>
    );
};
