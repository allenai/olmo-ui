import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Container, LinearProgress, Stack, Typography } from '@mui/material';
import styled from 'styled-components';

import { MetadataModal } from '../components/MetadataModal';
import { IdAndSourceComponent } from '../components/IdAndSourceComponent';
import { DolmaPanel } from '../components/DolmaPanel';
import { SearchResultsContainer } from '../components/shared';
import { dolma } from '../api/dolma';
import { Client } from '../api/Client';

interface Store {
    loading: boolean;
    error?: string;
    doc?: dolma.Doc;
}

export function Doc() {
    const params = useParams<{ id: string }>();

    const [{ loading, error, doc }, updateStore] = useState<Store>({ loading: false });

    const [metadataModalOpen, setMetadataModalOpen] = React.useState(false);
    const handleModalOpen = () => setMetadataModalOpen(true);
    const handleModalClose = () => setMetadataModalOpen(false);

    const api = new Client();
    useEffect(() => {
        if (!params.id) {
            return;
        }
        updateStore({ loading: true, error: undefined });
        api.doc(params.id)
            .then((doc) =>
                updateStore({
                    loading: false,
                    error: undefined,
                    doc,
                })
            )
            .catch((e) =>
                updateStore({
                    loading: false,
                    error: e.message,
                    doc: undefined,
                })
            );
    }, [params]);


    return (
        <SearchResultsContainer>
            <Stack direction={'row'} spacing={6}>
                <DolmaPanel />
                <Container>
                    {loading ? <LinearProgress /> : null}
                    {!loading && error ? (
                        <div>
                            <h4>Something went wrong.</h4>
                            <p>{error}</p>
                        </div>
                    ) : null}
                    {!loading && !error && doc ? (
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
                </Container>
            </Stack>
        </SearchResultsContainer>
    );
}

const TextParagraph = styled.p`
    white-space: pre-wrap;
`;
