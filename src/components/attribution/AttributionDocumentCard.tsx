import { Card, CardContent, Stack, Typography } from '@mui/material';

import { useAppContext } from '@/AppContext';

interface AttributionDocumentCardProps {
    title: string;
    text: string;
    source: string;
    documentIndex: string;
    // href: string;
}

export const AttributionDocumentCard = ({
    title,
    text,
    source,
    documentIndex,
}: AttributionDocumentCardProps): JSX.Element => {
    const isSelected = useAppContext(
        (state) => state.attribution.selectedDocumentIndex === documentIndex
    );

    return (
        <Card>
            <CardContent component={Stack} direction="column" gap={1}>
                <Typography variant="h6" margin={0}>
                    {title}
                </Typography>
                <Typography variant="body1">&quot;{text}&quot;...</Typography>
                <Typography variant="subtitle1" fontWeight="bold" component="span">
                    Source: {source}
                </Typography>
            </CardContent>
        </Card>
    );
};
