import { ExpandMore } from '@mui/icons-material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Link,
    Typography,
} from '@mui/material';
import { ComponentProps, createRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { useLocation } from 'react-router-dom';

import { useDesktopOrUp } from '../dolma/shared';
import { createFAQId } from './faq-utils';

const markdownComponents: ComponentProps<typeof Markdown>['components'] = {
    p: ({ children }) => <Typography variant="body1">{children}</Typography>,
    // The ref types don't match for some reason
    a: ({ ref, href, ...props }) => {
        // open the corresponding collapsed faq section for an interlink
        if (href && href[0] === '#') {
            return (
                <Link
                    onClick={() => {
                        const target = document.querySelector(href);
                        if (target) {
                            const targetSection = target as HTMLDivElement;
                            if (
                                !(
                                    targetSection.ariaExpanded &&
                                    targetSection.ariaExpanded === 'true'
                                )
                            ) {
                                targetSection.click();
                            }
                            targetSection.scrollIntoView(true);
                        }
                    }}
                    {...props}
                />
            );
        }

        return <Link href={href} {...props} target="_blank" />;
    },
    img: ({ src, alt }) => (
        <Box component="img" sx={{ display: 'inline-block' }} src={src} alt={alt} />
    ),
};

interface FAQProps {
    question: string;
    answer: string;
}

export const FAQ = ({ question, answer }: FAQProps): JSX.Element => {
    const location = useLocation();
    const isDesktopOrUp = useDesktopOrUp();
    const accordionRef = createRef<HTMLDivElement>();
    const faqId = createFAQId(question);
    const faqContentId = faqId + '-content';

    const isLinkedFAQ = location.hash === `#${faqId}`;
    const faqPaddings = isDesktopOrUp ? { padding: 0, paddingLeft: 4 } : { padding: 0 };

    useEffect(() => {
        if (accordionRef && accordionRef.current && isLinkedFAQ) {
            accordionRef.current.scrollIntoView(true);
        }
    }, [isLinkedFAQ, accordionRef]);

    return (
        <Accordion
            ref={accordionRef}
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
