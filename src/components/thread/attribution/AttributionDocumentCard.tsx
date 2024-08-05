import { Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material';

import { useAppContext } from '@/AppContext';

interface AttributionDocumentCardProps {
    title?: string;
    text: string;
    source: string;
    documentIndex: string;
    // href: string;
}

const MISSING_DOCUMENT_TITLE_TEXT = 'Untitled Document';

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
        <Card>
            <CardActionArea
                onClick={() => {
                    setSelectedDocument(documentIndex);
                }}>
                <CardContent
                    component={Stack}
                    direction="column"
                    gap={1}
                    sx={{
                        borderLeft: (theme) => `${theme.spacing(1)} solid transparent`,

                        '&:hover': {
                            borderColor: (theme) => theme.palette.primary.light,
                        },

                        '&[data-selected-document=true]': {
                            borderColor: (theme) => theme.palette.primary.main,
                        },
                    }}
                    data-selected-document={isSelected}>
                    <Typography variant="h6" component="h2" margin={0}>
                        {title ?? MISSING_DOCUMENT_TITLE_TEXT}
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
