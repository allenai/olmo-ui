import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';

import { createFAQId } from './createFAQId';

interface FAQProps extends PropsWithChildren {
    summary: string;
}

export const FAQ = ({ summary, children }: FAQProps) => {
    const location = useLocation();
    const faqId = createFAQId(summary);
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
                    {summary}
                </AccordionSummary>
            </Typography>
            <AccordionDetails id={faqContentId}>
                <Typography variant="body1">{children}</Typography>
            </AccordionDetails>
        </Accordion>
    );
};
