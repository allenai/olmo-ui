import { Box, Stack } from '@mui/material';
import styled from 'styled-components';

export const Content = styled(Stack).attrs({ spacing: 3 })``;

export const SearchResultsContainer = styled(Box)`
    background: white;
    border-radius: 2;
    ${({ theme }) => theme.breakpoints.up('md')} {
        padding-top: ${({ theme }) => theme.spacing(5)};
        padding-bottom: ${({ theme }) => theme.spacing(5)};
        padding-right: ${({ theme }) => theme.spacing(6)};
        padding-left: ${({ theme }) => theme.spacing(6)};
    }

    ${({ theme }) => theme.breakpoints.down('md')} {
        padding-top: ${({ theme }) => theme.spacing(2)};
        padding-bottom: ${({ theme }) => theme.spacing(2)};
        padding-right: ${({ theme }) => theme.spacing(3)};
        padding-left: ${({ theme }) => theme.spacing(3)};
    }
`;
