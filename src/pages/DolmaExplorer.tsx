import { Container } from '@mui/material';
import styled from 'styled-components';

import { DolmaCard } from '@/components/DolmaCard';

import { NewSearchPlaceholder } from '../components/dolma/NewSearchPlaceholder';
import { SearchForm } from '../components/dolma/SearchForm';

export const DolmaExplorer = () => (
    <>
        <CenterAlignedContainer>
            <DolmaCard />
            <SearchForm />
            <NewSearchPlaceholder />
        </CenterAlignedContainer>
    </>
);

const CenterAlignedContainer = styled(Container)`
    text-align: center;
`;
