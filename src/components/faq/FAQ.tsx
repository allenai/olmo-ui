import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Link, Typography } from '@mui/material';
import { ComponentProps } from 'react';
import Markdown from 'react-markdown';
import { useLocation } from 'react-router-dom';

import { createFAQId } from './createFAQId';

const markdownComponents: ComponentProps<typeof Markdown>['components'] = {
    p: ({ children }) => <Typography variant="body1">{children}</Typography>,
    // The ref types don't match for some reason
    a: ({ ref, ...props }) => <Link {...props} target="_blank" />,
};

interface FAQProps {
    question: string;
    answer: string;
}

export const FAQ = ({ question, answer }: FAQProps): JSX.Element => {
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
                    sx={{
                        color: 'inherit',
                    }}
                    aria-controls={faqContentId}>
                    <Typography variant="h6" component="span">
                        {question}
                    </Typography>
                </AccordionSummary>
            </Typography>
            <AccordionDetails id={faqContentId}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    <Markdown components={markdownComponents}>{answer}</Markdown>
                </Typography>
            </AccordionDetails>
        </Accordion>
    );
};
