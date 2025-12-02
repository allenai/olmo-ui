import { css } from '@allenai/varnish-panda-runtime/css';
import { cx } from '@allenai/varnish-ui';
import { Typography } from '@mui/material';
import { useLoaderData } from 'react-router-dom';

import { ContentContainer } from '@/components/ContentContainer';
import { MetaTags } from '@/components/MetaTags';
import { PageContainer } from '@/components/PageContainer';
import { LinkCardList } from '@/components/thread/ThreadPlaceholder/LinkCard/LinkCardList';
import { type ModelPageData } from '@/pages/model/modelPageLoader';

import { ModelCard } from './components/ModelCard';

const agentPageContentWrapper = css({
    display: 'flex',
    flexDirection: 'column',
    gap: '8',
    paddingBlockStart: '4',
    paddingInline: {
        base: '4',
        md: '8',
    },
    overflow: 'auto',
    alignItems: 'center',
    maxWidth: 'breakpoint-sm',
    width: '[100%]',
    marginInline: 'auto',
    marginTop: '[10dvh]',
});

const agentCardListClassName = css({
    gap: '8',
    width: '[100%]',
});

export const ModelPage = () => {
    const modelPageData = useLoaderData() as ModelPageData;

    return (
        <>
            <MetaTags />
            <PageContainer>
                <ContentContainer>
                    <div className={agentPageContentWrapper}>
                        <Typography variant="h1" component="h2" sx={{ textAlign: 'center' }}>
                            Models
                        </Typography>
                        <Typography variant="h4" component="p">
                            Explore our models
                        </Typography>
                        <LinkCardList
                            className={cx(agentCardListClassName, css({ marginTop: '[60px]' }))}>
                            {modelPageData.models.map((model) => (
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
                    </div>
                </ContentContainer>
            </PageContainer>
        </>
    );
};
