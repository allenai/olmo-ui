import { Box, List, Stack } from '@mui/material';

import { links } from '@/Links';

import { FooterLink } from './FooterLink';

export const Footer = () => {
    return (
        <Box component="footer" paddingBlockStart={6}>
            <Stack direction="row" flexWrap="wrap" gap={1} component={List}>
                <FooterLink href={links.feedbackForm}>Give Feedback</FooterLink>
            </Stack>
        </Box>
    );
};
