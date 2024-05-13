import { Box, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

import { createFAQId } from './createFAQId';

interface FAQCategoryProps extends PropsWithChildren {
    categoryName: string;
}

export const FAQCategory = ({ categoryName, children }: FAQCategoryProps) => {
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
            {children}
        </Box>
    );
};
