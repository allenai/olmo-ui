import styled from 'styled-components';
import { Container, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

import { NewSearchPlaceholder } from '../components/dolma/NewSearchPlaceholder';
import { SearchForm } from '../components/dolma/SearchForm';
import { SearchContainer, SectionHeading } from '../components/dolma/shared';
import aiOpennessSrc from '../assets/ai-openness.jpg';
import dolmaResearchSrc from '../assets/dolma-research.jpg';
import { GeekWireLogo } from '../logos/GeekWireLogo';
import { NYTLogo } from '../logos/NYTLogo';
import { WiredLogo } from '../logos/WiredLogo';
import { TechCrunchLogo } from '../logos/TechCrunchLogo';
import { WordDist } from '../components/dolma/WordDist';
import { MetaTags } from '../components/dolma/MetaTags';
import { Sources } from '../components/dolma/Sources';
import { Domains } from '../components/dolma/Domains';

export const DolmaExplorer = () => (
    <>
        <MetaTags title="Dolma - AI2's Open Pretraining Dataset for AI Language Models" />
        <InfoSection>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="center">
                <ResponsiveImage
                    src={aiOpennessSrc}
                    alt="Illustration of colored rectangles unfurling around a central point, representing openness"
                    width="464"
                    height="309"
                />
                <InfoPanel>
                    <SectionHeading>Openness in AI is mission critical.</SectionHeading>
                    <InfoParagraph>
                        Generative language models have revolutionized the field of AI and are
                        poised to have a huge impact on society, but many of the details of the
                        inner workings of the most powerful models today are kept behind closed
                        doors. At AI2, we believe that true openness is essential for
                        collaboratively building the next generation of responsible and effective
                        AI.
                    </InfoParagraph>
                </InfoPanel>
            </Stack>
        </InfoSection>
        <GreySection>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="center">
                <InfoPanel>
                    <SectionHeading>
                        3 trillion token open corpus for language model pretraining
                    </SectionHeading>
                    <InfoParagraph>
                        Dolma is an open dataset of 3 trillion tokens from a diverse mix of web
                        content, academic publications, code, books, and encyclopedic materials. It
                        is generally available for download from the Hugging Face Hub and is
                        distributed under the{' '}
                        <a href="https://allenai.org/impact-license">AI2 ImpACT license</a>. It is
                        the largest openly available dataset to date for language model training.
                    </InfoParagraph>
                    <a href="/about">See the latest Dolma research →</a>
                </InfoPanel>
                <ResponsiveImage
                    src={dolmaResearchSrc}
                    alt="Illustration of many colored blocks with varying heights representing Big Data"
                />
            </Stack>
        </GreySection>
        <InfoSection>
            <ConstrainedCenterAlignedContainer>
                <SectionHeading>What&apos;s in Dolma?</SectionHeading>
                <WordDist />
            </ConstrainedCenterAlignedContainer>
        </InfoSection>
        <GreySection>
            <ConstrainedCenterAlignedContainer>
                <SectionHeading>Dolma&apos;s Sources and Domains</SectionHeading>
                <Sources />
                <Domains />
            </ConstrainedCenterAlignedContainer>
        </GreySection>
        <InfoSection>
            <SearchContainer>
                <ConstrainedCenterAlignedContainer>
                    <SectionHeading>Search Dolma</SectionHeading>
                    <p>
                        Today&apos;s language models are trained on large datasets like Dolma, but
                        little is known about what&apos;s in those datasets. Dolma is a free and
                        open pretraining dataset that you can explore for yourself.
                    </p>
                    <SearchForm />
                    <NewSearchPlaceholder />
                </ConstrainedCenterAlignedContainer>
            </SearchContainer>
        </InfoSection>
        <GreySection>
            <CenterAlignedContainer>
                <SectionHeading>Dolma in the News</SectionHeading>
                <NewsStack spacing={6} direction="row" justifyContent="center" flexWrap="wrap">
                    <Link
                        to={
                            'https://www.geekwire.com/2023/allen-institute-for-ai-takes-new-approach-to-managing-ai-risks-and-promoting-transparency/'
                        }
                        target="_blank">
                        <GeekWireLogo />
                    </Link>
                    <Link
                        to={
                            'https://www.nytimes.com/2023/10/19/technology/allen-institute-open-source-ai.html'
                        }
                        target="_blank">
                        <NYTLogo />
                    </Link>
                    <Link
                        to={'https://www.wired.com/story/fast-forward-ai-powerful-secretive/'}
                        target="_blank">
                        <WiredLogo />
                    </Link>
                    <Link
                        to={
                            'https://techcrunch.com/2023/08/18/ai2-drops-biggest-open-dataset-yet-for-training-language-models/'
                        }
                        target="_blank">
                        <TechCrunchLogo />
                    </Link>
                </NewsStack>
            </CenterAlignedContainer>
        </GreySection>
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

const BaseSection = styled.div`
    padding: ${({ theme }) => `${theme.spacing(8)} ${theme.spacing(3)}`};
`;

const GreySection = styled(BaseSection)`
    width: 100%;
    background-color: ${({ theme }) => theme.color2.N1.hex};
    text-align: center;
`;

const InfoSection = styled(BaseSection)`
    max-width: 1200px;
    margin: auto;
`;

const InfoPanel = styled.div`
    ${({ theme }) => theme.breakpoints.up('md')} {
        max-width: 500px;
    }
    text-align: left;
`;

const InfoParagraph = styled.p`
    padding-bottom: ${({ theme }) => theme.spacing(1)};
`;

const NewsStack = styled(Stack)`
    padding-bottom: ${({ theme }) => theme.spacing(2)};
`;

const ResponsiveImage = styled.img`
    ${({ theme }) => theme.breakpoints.down('md')} {
        width: 100%;
        height: auto;
    }
`;
