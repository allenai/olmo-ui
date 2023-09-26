import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Container, LinearProgress, Stack, Typography } from '@mui/material';
import styled from 'styled-components';

import { MetadataModal } from '../components/MetadataModal';
import { IdAndSourceComponent } from '../components/IdAndSourceComponent';
import { DolmaPanel } from '../components/DolmaPanel';
import { SearchResultsContainer } from '../components/shared';

export interface DataDoc {
    id: string;
    dolma_id: string;
    text: string;
    first_n: string;
    source: string;
    url?: string;
}

export function Doc() {
    const params = useParams<{ id: string }>();

    const [doc, setDoc] = useState<DataDoc | undefined>();
    const [isLoading, setIsLoading] = useState(false);

    const [metadataModalOpen, setMetadataModalOpen] = React.useState(false);
    const handleModalOpen = () => setMetadataModalOpen(true);
    const handleModalClose = () => setMetadataModalOpen(false);

    useEffect(() => {
        setIsLoading(true);
        const url = `${process.env.LLMX_API_URL}/v3/data/doc/${params.id}`;
        fetch(url, { credentials: 'include' })
            .then((r) => r.json())
            .then((r) => setDoc(r))
            .finally(() => setIsLoading(false));
    }, [params]);

    return (
        <SearchResultsContainer>
            <Stack direction={'row'} spacing={6}>
                <DolmaPanel />
                <Container>
                    {doc && !isLoading ? (
                        <>
                            <IdAndSourceComponent
                                idDescriptor="Dolma ID"
                                id={doc.dolma_id}
                                source={doc.source}
                                truncateId={false}
                                idUrl={doc.url}
                            />
                            <h4 style={{ marginTop: '8px' }}>{doc.first_n}</h4>

                            <pre>
                                <TextParagraph>{doc.text}</TextParagraph>
                            </pre>
                            <Button
                                disableRipple={true}
                                variant="outlined"
                                onClick={handleModalOpen}>
                                <Typography>View Metadata</Typography>
                                <MetadataModal
                                    onClose={handleModalClose}
                                    open={metadataModalOpen}
                                    metadata={doc}
                                />
                            </Button>
                        </>
                    ) : null}
                    {!doc || isLoading ? <LinearProgress /> : null}
                </Container>
            </Stack>
        </SearchResultsContainer>
    );
}

const TextParagraph = styled.p`
    white-space: pre-wrap;
`;
