import { Stack } from '@mui/material';
import React from 'react';

import styled from 'styled-components';

import { DolmaLogo } from './logos/DolmaLogo';

export const DolmaPanel = () => {
    return (
        <div style={{ padding: '8px' }}>
            <DolmaLogo />
            <DolmaParagraph>
                Dolma is the open dataset used for OLMo pretraining. It consists of 3 trillion
                tokens from a diverse mix of web content, academic publications, code, books, and
                encyclopedic materials. It is the largest open dataset to date for LLM training, and
                is distributed under{' '}
                <a href="https://allenai.org/impact-license">AI2's ImpACT license</a>.
            </DolmaParagraph>
            <Stack spacing={1}>
                <a href="https://huggingface.co/datasets/allenai/dolma">Download on HuggingFace</a>
                <a href="https://github.com/allenai/dolma">GitHub Repository</a>
                <a href="https://blog.allenai.org/dolma-3-trillion-tokens-open-llm-corpus-9a0ff4b8da64">
                    Blog Post
                </a>
                <a href="https://drive.google.com/file/d/12gOf5I5RytsD159nSP7iim_5zN31FCXq/view?usp=drive_link">
                    Data Sheet
                </a>
            </Stack>
        </div>
    );
};

const DolmaParagraph = styled.p`
    ${({ theme }) => theme.breakpoints.up('md')} {
        width: ${({ theme }) => theme.spacing(38)};
    }

    ${({ theme }) => theme.breakpoints.down('md')} {
        width: 100%;
    }
`;
