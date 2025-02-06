import { Box, Stack } from '@mui/material';

import type { AttributionDocumentSnippet } from '@/api/AttributionClient';

import { BoldTextForDocumentAttribution } from './BoldTextForDocumentAttribution';

interface AttributionDocumentCardSnippetsProps {
    snippets: AttributionDocumentSnippet[];
}
export const AttributionDocumentCardSnippets = ({
    snippets,
}: AttributionDocumentCardSnippetsProps) => {
    if (snippets.length === 0) {
        return null;
    }

    return (
        <Stack direction="column" gap={1}>
            <Box sx={{ display: 'contents' }}>
                {snippets.map((snippet) => (
                    <BoldTextForDocumentAttribution
                        key={snippet.text}
                        correspondingSpans={[snippet.corresponding_span_text]}
                        text={snippet.text}
                    />
                ))}
            </Box>
        </Stack>
    );
};
