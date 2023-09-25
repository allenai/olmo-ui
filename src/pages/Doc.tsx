import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Dialog, DialogTitle, LinearProgress, Stack, Typography } from '@mui/material';
import { DolmaLogo } from '../components/logos/DolmaLogo';
import styled from 'styled-components';

interface DataDoc {
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

    const [metadataModalOpen, setMetadataModalOpen] = React.useState(false);
    const handleModalOpen = () => setMetadataModalOpen(true);
    const handleModalClose = () => setMetadataModalOpen(false);

    const MetadataModal = () => {
        return (
            <Dialog onClose={handleModalClose} open={metadataModalOpen}>
                <Metadata><pre>{JSON.stringify(doc, null, 2)}</pre></Metadata>
            </Dialog>
        );
    };

    useEffect(() => {
        const url = `${process.env.LLMX_API_URL}/v3/data/doc/${params.id}`;
        fetch(url, { credentials: 'include' })
            .then((r) => r.json())
            .then((r) => setDoc(r));
    }, [params]);

    return (
        <Box sx={{ background: 'white', borderRadius: 2, p: 2 }}>
            <Stack direction={'row'} spacing={6}>
                    <div style={{padding: '8px'}}>
                        <DolmaLogo />
                        <DolmaParagraph>
                            Dolma is the open dataset used for OLMo pretraining. It consists of 3
                            trillion tokens from a diverse mix of web content, academic publications,
                            code, books, and encyclopedic materials. It is the largest open dataset to
                            date for LLM training, and is distributed under{' '}
                            <a href="https://allenai.org/impact-license">AI2's ImpACT license</a>.
                        </DolmaParagraph>
                        <Stack spacing={1}>
                            <a href="https://huggingface.co/datasets/allenai/dolma">
                                Download on HuggingFace
                            </a>
                            <a href="https://github.com/allenai/dolma">GitHub Repository</a>
                            <a href="https://blog.allenai.org/dolma-3-trillion-tokens-open-llm-corpus-9a0ff4b8da64">
                                Blog Post
                            </a>
                            <a href="https://drive.google.com/file/d/12gOf5I5RytsD159nSP7iim_5zN31FCXq/view?usp=drive_link">
                                Data Sheet
                            </a>
                        </Stack>
                    </div>
                    <div>
                        {doc ? (
                            <>
                                <h4 style={{marginTop: '8px'}}>{doc.first_n}</h4>
                                <p>Dolma ID: {doc.dolma_id} | Source: {doc.source}</p>
                                <p>{doc.text}</p>
                                <MetadataButton variant="text" onClick={handleModalOpen}>
                                        <Typography>View Metadata</Typography>
                                        <MetadataModal />
                                </MetadataButton>
                            </>

                        ) : (
                            <LinearProgress />
                        )}
                    </div>
            </Stack>
        </Box>
    );
}

const DolmaParagraph = styled.p`
    ${({ theme }) => theme.breakpoints.up('md')} {
        width: ${({ theme }) => theme.spacing(38)};
    }

    ${({ theme }) => theme.breakpoints.down('md')} {
        width: 100%;
    }
`;

const MetadataButton = styled(Button)`
    && {
        color: ${({ theme }) => theme.color2.B4};
    }
`;

const Metadata = styled(DialogTitle)`
    white-space: pre-wrap;
`;