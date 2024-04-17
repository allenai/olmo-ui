import styled from 'styled-components';
import { Container } from '@mui/material';

import { NewSearchPlaceholder } from '../components/dolma/NewSearchPlaceholder';
import { SearchForm } from '../components/dolma/SearchForm';
import { MetaTags } from '../components/dolma/MetaTags';

export const DolmaExplorer = () => (
    <>
        <MetaTags title="Dolma - AI2's Open Pretraining Dataset for AI Language Models" />
        <CenterAlignedContainer>
            <SearchForm />
            <NewSearchPlaceholder />
        </CenterAlignedContainer>
    </>
);

const CenterAlignedContainer = styled(Container)`
    text-align: center;
`;
