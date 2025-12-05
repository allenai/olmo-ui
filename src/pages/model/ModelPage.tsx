import { css } from '@allenai/varnish-panda-runtime/css';
import { Typography } from '@mui/material';
import { useLoaderData } from 'react-router-dom';

import { ContentContainer } from '@/components/ContentContainer';
import { MetaTags } from '@/components/MetaTags';
import { PageContainer } from '@/components/PageContainer';
import { LinkCardList } from '@/components/thread/ThreadPlaceholder/LinkCard/LinkCardList';
import { type ModelPageData } from '@/pages/model/modelPageLoader';

import { ModelCard } from './components/ModelCard';
import { selectFeaturedModels } from './selectFeaturedModels';

const agentPageContentWrapper = css({
    display: 'flex',
    flexDirection: 'column',
    gap: '8',
    paddingBlockStart: '[4dvh]',
    paddingInline: {
        base: '4',
        md: '8',
    },
    overflowY: 'auto',
    alignItems: 'center',
    width: '[100%]',
    marginInline: 'auto',
    paddingBlockEnd: '8',
});

const agentCardListClassName = css({
    gap: '8',
    width: '[100%]',
    maxWidth: 'breakpoint-md',
});

export const ModelPage = () => {
    const modelPageData = useLoaderData() as ModelPageData;

    const featuredModels = ['molmo-2', 'olmo-3-32b-think', 'olmo-3-7b-instruct']
        .map((modelId) =>
            modelPageData.models.find((model) => model.id.toLocaleLowerCase().startsWith(modelId))
        )
        .filter((i) => !!i);

    const nonFeaturedModels = modelPageData.models.filter(
        (model) => !!featuredModels.find((featuredModel) => featuredModel.id !== model.id)
    );

    return (
        <>
            <MetaTags />
            <PageContainer>
                <ContentContainer
                    className={css({
                        paddingBlockStart: {
                            base: '0',
                            lg: '0',
                        },
                    })}>
                    <div className={agentPageContentWrapper}>
                        <Typography variant="h1" component="h2" sx={{ textAlign: 'center' }}>
                            Models
                        </Typography>
                        <Typography variant="h3" component="p">
                            Our featured models
                        </Typography>
                        <LinkCardList className={agentCardListClassName}>
                            {featuredModels.map((model) => (
                                <ModelCard
                                    key={model.name}
                                    type="playground"
                                    id={model.id}
                                    name={model.name}
                                    description={model.description}
                                    informationUrl={model.information_url}
                                />
                            ))}
                        </LinkCardList>
                        <Typography variant="h3" sx={{ marginTop: 3 }}>
                            All our models
                        </Typography>
                        <LinkCardList columns="two" className={agentCardListClassName}>
                            {nonFeaturedModels
                                .filter((model) => {
                                    return !model.internal;
                                })
                                .map((model) => (
                                    <ModelCard
                                        key={model.name}
                                        type="playground"
                                        imageUrl={false}
                                        id={model.id}
                                        name={model.name}
                                        description={model.description}
                                        informationUrl={model.information_url}
                                        variant="list"
                                        color="faded"
                                    />
                                ))}
                        </LinkCardList>
                    </div>
                </ContentContainer>
            </PageContainer>
        </>
    );
};
