import { Link, Typography } from '@mui/material';
import { ReactNode } from 'react';

import { Document as AttributionDocument } from '@/api/AttributionClient';

interface PrettySourceProps {
    document: AttributionDocument;
}

export const PrettifySource = ({ document }: PrettySourceProps): ReactNode => {
    return (
        <>
            {document.sourceUrl != null ? (
                <Link
                    href={document.sourceUrl}
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
                    {document.displayName}
                </Link>
            ) : (
                <Typography fontWeight={600}>{document.displayName}</Typography>
            )}

            {document.secondaryName != null && (
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
                    {document.secondaryName}
                </Typography>
            )}
        </>
    );
};
