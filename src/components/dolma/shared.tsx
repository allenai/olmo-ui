import { useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { Box, Container, Grid, TextField } from '@mui/material';

export const ScrollToTopOnPageChange = () => {
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    return null;
};

export const SearchContainer = styled(Box)`
    ${({ theme }) => theme.breakpoints.up('md')} {
        padding: ${({ theme }) => `${theme.spacing(5)} ${theme.spacing(6)}`};
    }
    ${({ theme }) => theme.breakpoints.down('md')} {
        padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(3)}`};
    }
`;

export const NoPaddingContainer = styled(Container)`
    &&& {
        padding: 0;
    }
`;

export const NoPaddingGrid = styled(Grid)`
    &&& {
        padding-top: 0;
        padding-left: 0;
    }
`;

export const Section = styled.div`
    padding-top: ${({ theme }) => theme.spacing(2)};
    padding-bottom: ${({ theme }) => theme.spacing(2)};
`;

export const PageHeading = styled.h1`
    margin-top: 0px;
    font-size: ${({ theme }) => theme.typography.h2};
`;

export const SectionHeading = styled.h2`
    margin-top: ${({ theme }) => theme.spacing(1)};
    font-size: ${({ theme }) => theme.typography.h3};
`;

export const InfoParagraph = styled.p`
    padding-bottom: ${({ theme }) => theme.spacing(1)};
`;
