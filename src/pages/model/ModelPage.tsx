import { css } from '@allenai/varnish-panda-runtime/css';
import { Typography } from '@mui/material';
import { useLoaderData } from 'react-router-dom';

import { ContentContainer } from '@/components/ContentContainer';
import { MetaTags } from '@/components/MetaTags';
import { PageContainer } from '@/components/PageContainer';
import { isModelPubliclyAvailable } from '@/components/thread/ModelSelect/useModels';
import { LinkCardList } from '@/components/thread/ThreadPlaceholder/LinkCard/LinkCardList';
import { type ModelPageData } from '@/pages/model/modelPageLoader';

import { ModelCard } from './components/ModelCard';
import { FEATURED_MODELS } from './featuredModels';

const pageContentWrapper = css({
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

const cardListClassName = css({
    gap: '8',
    width: '[100%]',
    maxWidth: 'breakpoint-md',
});

export const ModelPage = () => {
    const modelPageData = useLoaderData() as ModelPageData;
    const publicModels = modelPageData.models.filter(isModelPubliclyAvailable);

    const featuredModels = FEATURED_MODELS.map(({ id, image }) => {
        const model = publicModels.find((model) => model.id.toLocaleLowerCase() === id);
        // return both or neither
        return model
            ? {
                  model,
                  image,
              }
            : undefined;
    }).filter((m) => !!m);

    const nonFeaturedModels = publicModels.filter((model) => {
        return !featuredModels.some((featuredModel) => featuredModel.model.id === model.id);
    });

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
                    <div className={pageContentWrapper}>
                        <Typography variant="h1" component="h2" sx={{ textAlign: 'center' }}>
                            Models
                        </Typography>
                        {featuredModels.length > 0 ? (
                            <>
                                <Typography variant="h3" component="p">
                                    Our featured models
                                </Typography>
                                <LinkCardList className={cardListClassName}>
                                    {featuredModels.map(({ model, image }) => (
                                        <ModelCard
                                            key={model.name}
                                            type="playground"
                                            imageUrl={image}
                                            id={model.id}
                                            name={model.name}
                                            description={model.description}
                                            informationUrl={model.informationUrl}
                                        />
                                    ))}
                                </LinkCardList>
                                <Typography variant="h3" sx={{ marginTop: 3 }}>
                                    Explore more
                                </Typography>
                            </>
                        ) : null}
                        <LinkCardList columns="two" className={cardListClassName}>
                            {nonFeaturedModels.map((model) => (
                                <ModelCard
                                    key={model.name}
                                    type="playground"
                                    id={model.id}
                                    name={model.name}
                                    description={model.description}
                                    informationUrl={model.informationUrl}
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
