import { css } from '@allenai/varnish-panda-runtime/css';

import { Agent } from '@/api/playgroundApi/additionalTypes';
import { LinkCard } from '@/components/thread/ThreadPlaceholder/LinkCard/LinkCard';
import { LinkCardList } from '@/components/thread/ThreadPlaceholder/LinkCard/LinkCardList';

import { makeAgentTemplatePath } from './makeAgentTemplatePaht';

export type PromptTemplate = {
    id: string;
    content: string;
    imageUrl?: string;
};

export type PromptTemplateListProps = {
    agentId: Agent['id'];
    promptTemplates: PromptTemplate[];
};

const promptCardClassName = css({
    height: {
        base: '[100px]',
        md: 'auto',
    },
});

export const PromptTemplateList = ({ agentId, promptTemplates }: PromptTemplateListProps) => {
    return (
        <div>
            <p>
                Start with one of these sample prompts, or upload an image and ask a question below.
            </p>
            <LinkCardList className={css({ width: '[100%]', marginTop: '[40px]' })}>
                {promptTemplates.map(({ id, content, imageUrl }) => (
                    <LinkCard
                        key={id}
                        url={makeAgentTemplatePath({
                            agentId,
                            templateId: id,
                        })}
                        image={imageUrl}
                        className={promptCardClassName}>
                        {content}
                    </LinkCard>
                ))}
            </LinkCardList>
        </div>
    );
};
