import { ExpandMore } from '@mui/icons-material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Link,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
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
    const theme = useTheme();
    const greaterThanLg = useMediaQuery(theme.breakpoints.up('lg'));

    const faqId = createFAQId(question);
    const faqContentId = faqId + '-content';

    const isLinkedFAQ = location.hash === `#${faqId}`;
    const faqPaddings = greaterThanLg ? { padding: 0, paddingLeft: 4 } : { padding: 0 };

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
            <AccordionSummary
                id={faqId}
                expandIcon={<ExpandMore />}
                sx={{
                    color: 'inherit',
                    ...faqPaddings,
                }}
                aria-controls={faqContentId}>
                <Typography variant="h6" component="span">
                    {question}
                </Typography>
            </AccordionSummary>
            <AccordionDetails id={faqContentId} sx={faqPaddings}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }} mb={2.5}>
                    <Markdown components={markdownComponents}>{answer}</Markdown>
                </Typography>
            </AccordionDetails>
        </Accordion>
    );
};
