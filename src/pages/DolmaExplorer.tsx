import { Grid, Stack } from '@mui/material';

import { useDesktopOrUp } from '@/components/dolma/shared';
import { DolmaCard } from '@/components/DolmaCard';
import { DolmaInformationCard } from '@/components/DolmaInformationCard';

import { NewSearchPlaceholder } from '../components/dolma/NewSearchPlaceholder';
import { SearchForm } from '../components/dolma/SearchForm';

export const DolmaExplorer = () => {
    const isDesktopOrUp = useDesktopOrUp();
    return (
        <>
            <Stack sx={{ textAlign: 'center' }} spacing={2}>
                <DolmaCard />
                {isDesktopOrUp ? (
                    <Grid container spacing={2} sx={{ display: 'flex' }}>
                        <Grid item xs={6} sx={{ display: 'flex' }}>
                            <DolmaInformationCard
                                linkText="Learn More"
                                title="How was Dolma Created?"
                                buttonText="Read the Blog"
                            />
                        </Grid>
                        <Grid item xs={6} sx={{ display: 'flex' }}>
                            <DolmaInformationCard
                                linkText="Research"
                                title="Access the Dataset on Hugging Face"
                                buttonText="Get Started"
                            />
                        </Grid>
                    </Grid>
                ) : (
                    <Stack spacing={2}>
                        <DolmaInformationCard
                            linkText="Learn More"
                            title="How was Dolma Created?"
                            buttonText="Read the Blog"
                        />
                        <DolmaInformationCard
                            linkText="Research"
                            title="Access the Dataset on Hugging Face"
                            buttonText="Get Started"
                        />
                    </Stack>
                )}
                <SearchForm />
                <NewSearchPlaceholder />
            </Stack>
        </>
    );
};
