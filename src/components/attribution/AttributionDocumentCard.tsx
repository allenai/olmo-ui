import { ButtonBase, Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material';

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

    const setSelectedDocument = useAppContext((state) => state.setSelectedDocument);

    return (
        <Card
            sx={{
                borderLeft: (theme) => `${theme.spacing(0.5)} solid transparent`,

                '&:hover': {
                    borderColor: (theme) => theme.palette.primary.light,
                },

                '&[data-selected-document=true]': {
                    borderColor: (theme) => theme.palette.primary.main,
                },
            }}
            data-selected-document={isSelected}>
            <CardActionArea
                onClick={() => {
                    setSelectedDocument(documentIndex);
                }}>
                <CardContent component={Stack} direction="column" gap={1}>
                    <Typography variant="h6" margin={0}>
                        {title}
                    </Typography>
                    <Typography variant="body1">&quot;{text}&quot;...</Typography>
                    <Typography variant="subtitle1" fontWeight="bold" component="span">
                        Source: {source}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};
