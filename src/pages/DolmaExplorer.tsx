import { Container } from '@mui/material';
import styled from 'styled-components';

import { MetaTags } from '../components/dolma/MetaTags';
import { NewSearchPlaceholder } from '../components/dolma/NewSearchPlaceholder';
import { SearchForm } from '../components/dolma/SearchForm';

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
