import { Link, Typography } from '@mui/material';
import { ReactNode } from 'react';

import { Document as AttributionDocument } from '@/api/AttributionClient';

export const prettifySource = (document: AttributionDocument): ReactNode => {
    return (
        <>
            <Link
                href={document.source_url}
                target="_blank"
                fontWeight={600}
                color="primary"
                underline="always"
                sx={{
                    '[data-selected-document=true] &': {
                        color: 'inherit',
                        textDecorationColor: 'currentColor',
                    },
                }}>
                {document.display_name}
            </Link>
            {document.secondary_name != null && (
                <Typography
                    variant="body2"
                    component="span"
                    sx={(theme) => ({
                        color: theme.palette.text.secondary,
                        '[data-selected-document=true] &': {
                            color: 'inherit',
                        },
                    })}>
                    {' > '}
                    {document.secondary_name}
                </Typography>
            )}
        </>
    );
};
