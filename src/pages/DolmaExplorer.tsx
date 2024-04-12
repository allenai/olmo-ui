import styled from 'styled-components';
import { Container } from '@mui/material';

import { NewSearchPlaceholder } from '../components/dolma/NewSearchPlaceholder';
import { SearchForm } from '../components/dolma/SearchForm';
import { MetaTags } from '../components/dolma/MetaTags';
import { ElevatedCard } from '@/components/dolma/shared';

export const DolmaExplorer = () => (
    <>
        <MetaTags title="Dolma - AI2's Open Pretraining Dataset for AI Language Models" />
        <ConstrainedCenterAlignedContainer>
            <ElevatedCard>
                <SearchForm />
            </ElevatedCard>
            <NewSearchPlaceholder />
        </ConstrainedCenterAlignedContainer>
    </>
);

const CenterAlignedContainer = styled(Container)`
    text-align: center;
`;

const ConstrainedCenterAlignedContainer = styled(CenterAlignedContainer)`
    &&& {
        max-width: 800px;
    }
`;
