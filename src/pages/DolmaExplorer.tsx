import styled from 'styled-components';
import { Container } from '@mui/material';

import { NewSearchPlaceholder } from '../components/dolma/NewSearchPlaceholder';
import { SearchForm } from '../components/dolma/SearchForm';

export const DolmaExplorer = () => (
    <>
        <CenterAlignedContainer>
            <SearchForm />
            <NewSearchPlaceholder />
        </CenterAlignedContainer>
    </>
);

const CenterAlignedContainer = styled(Container)`
    text-align: center;
`;
