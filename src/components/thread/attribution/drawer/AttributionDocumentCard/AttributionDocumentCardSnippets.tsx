import { Box, Link, Stack } from '@mui/material';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useAppContext } from '@/AppContext';

import { BoldTextForDocumentAttribution } from './BoldTextForDocumentAttribution';

const SNIPPET_TRANSITION_TIME = '300ms';

interface AttributionDocumentCardSnippetsProps {
    documentIndex: string;
}
export const AttributionDocumentCardSnippets = ({
    documentIndex,
}: AttributionDocumentCardSnippetsProps) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => {
        setExpanded((prevExpanded) => !prevExpanded);
    };

    const snippets = useAppContext(
        useShallow((state) => {
            const selectedMessageId = state.attribution.selectedMessageId;

            if (selectedMessageId != null) {
                const documents =
                    state.attribution.attributionsByMessageId[selectedMessageId]?.documents ?? {};

                const document = documents[documentIndex];

                return document?.snippets ?? [];
            } else {
                return [];
            }
        })
    );

    if (snippets.length === 0) {
        return null;
    }

    const [firstSnippet, ...restSnippets] = snippets;

    return (
        <Stack direction="column" gap={1}>
            <Box>
                <BoldTextForDocumentAttribution
                    key={firstSnippet.text}
                    correspondingSpans={[firstSnippet.corresponding_span_text]}
                    text={firstSnippet.text}
                />
            </Box>
            <Box
                sx={[
                    {
                        // This uses grid's ability to transition to 1fr height to animate the other snippets showing
                        // https://css-tricks.com/css-grid-can-do-auto-height-transitions/
                        display: 'grid',
                        gridTemplateRows: '1fr',
                        overflow: 'hidden',
                        transitionProperty: 'grid-template-rows, margin-block-end',
                        transitionDuration: SNIPPET_TRANSITION_TIME,
                        transitionTimingFunction: 'ease',
                    },
                    !expanded && {
                        marginBlockEnd: -1,
                        gridTemplateRows: '0fr',
                    },
                ]}>
                <Stack
                    gap={1}
                    sx={[
                        {
                            // This combines with the grid transition above to help the animation
                            minHeight: 0,
                            transition: `visibility ${SNIPPET_TRANSITION_TIME}`,
                            visibility: 'visible',
                        },
                        !expanded && {
                            visibility: 'hidden',
                        },
                    ]}>
                    {restSnippets.map((snippet) => (
                        <BoldTextForDocumentAttribution
                            key={snippet.text}
                            correspondingSpans={[snippet.corresponding_span_text]}
                            text={snippet.text}
                        />
                    ))}
                </Stack>
            </Box>

            {snippets.length > 1 && (
                <Link
                    component="button"
                    onClick={toggleExpanded}
                    underline="always"
                    alignSelf="start">
                    Show {expanded ? 'less' : 'more'}
                </Link>
            )}
        </Stack>
    );
};
