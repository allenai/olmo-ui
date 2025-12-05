import { css } from '@allenai/varnish-panda-runtime/css';
import { createSearchParams } from 'react-router-dom';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { LinkCard } from '@/components/thread/ThreadPlaceholder/LinkCard/LinkCard';
import { LinkCardList } from '@/components/thread/ThreadPlaceholder/LinkCard/LinkCardList';
import { links } from '@/Links';
import { PARAM_SELECTED_MODEL, PARAM_SELECTED_TEMPLATE } from '@/pages/queryParameterConsts';

export type PromptTemplate = {
    id: string;
    content: string;
    fileUrls?: string[] | null;
};

export type ModelExampleListProps = {
    modelId: Model['id'];
    introText: string;
    promptTemplates: PromptTemplate[];
};

const promptCardClassName = css({
    minHeight: '[100px]',
});

export const ModelExampleList = ({
    modelId,
    introText,
    promptTemplates,
}: ModelExampleListProps) => {
    return (
        <div>
            <p>{introText}</p>
            <LinkCardList className={css({ width: '[100%]', marginTop: '[40px]' })}>
                {promptTemplates.map((template) => (
                    <ExampleCard key={template.id} {...template} modelId={modelId} />
                ))}
            </LinkCardList>
        </div>
    );
};

interface ExampleCardProps extends PromptTemplate {
    modelId: string;
}

const ExampleCard = ({ id, modelId, content, fileUrls }: ExampleCardProps) => {
    const searchParams = createSearchParams({
        [PARAM_SELECTED_TEMPLATE]: id,
        [PARAM_SELECTED_MODEL]: modelId,
    });
    const link = `${links.playground}?${searchParams}`;

    return (
        <LinkCard key={id} url={link} mediaUrl={fileUrls?.[0]} className={promptCardClassName}>
            {content}
        </LinkCard>
    );
};
