import { Box, Stack } from '@mui/material';
import styled from 'styled-components';

export const Content = styled(Stack).attrs({ spacing: 3 })``;

export const SearchResultsContainer = styled(Box)`
    background: white;
    border-radius: 2;
    ${({ theme }) => theme.breakpoints.up('md')} {
        padding: ${({ theme }) => `${theme.spacing(5)} ${theme.spacing(6)}`};
    }
    ${({ theme }) => theme.breakpoints.down('md')} {
        padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(3)}`};
    }
`;
