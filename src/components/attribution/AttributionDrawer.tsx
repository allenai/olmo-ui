import { Stack } from '@mui/material';

import { useAppContext } from '@/AppContext';

import { AttributionDocumentCard } from './AttributionDocumentCard';

export const AttributionDrawerContent = (): JSX.Element => {
    const documents = useAppContext((state) => state.attribution.documents);

    return (
        <Stack direction="column" gap={2}>
            {Object.values(documents).map((document) => (
                <AttributionDocumentCard
                    key={document.index}
                    documentIndex={document.index}
                    title={document.title}
                    text={document.text}
                    source={document.source}
                />
            ))}
        </Stack>
    );
};
