import { Typography } from '@mui/material';

import { escapeRegExp } from '@/utils/escape-reg-exp';

interface BoldTextForDocumentAttributionProps {
    correspondingSpans: string[] | undefined;
    text: string;
    lineBreak?: boolean;
}

export const BoldTextForDocumentAttribution = ({
    correspondingSpans,
    text,
    lineBreak = false,
}: BoldTextForDocumentAttributionProps) => {
    if (!correspondingSpans) {
        return text;
    }

    // Create a regex pattern that matches all substrings
    const regexPattern = new RegExp(`(${correspondingSpans.map(escapeRegExp).join('|')})`, 'gi');

    // Split the text based on the substrings
    const splitTextSegments = text.split(regexPattern);

    return (
        <Typography
            variant="body1"
            sx={{ wordBreak: 'break-word' }}
            component="blockquote"
            whiteSpace={lineBreak ? 'break-spaces' : undefined}>
            &quot;...
            {splitTextSegments.map((segment, index) => {
                // Check if the segment matches any of the substrings exactly
                const isExactMatch = correspondingSpans.some(
                    (substring) => substring.toLowerCase() === segment.toLowerCase()
                );

                return isExactMatch ? <strong key={index}>{segment}</strong> : segment;
            })}
            ...&quot;
        </Typography>
    );
};
