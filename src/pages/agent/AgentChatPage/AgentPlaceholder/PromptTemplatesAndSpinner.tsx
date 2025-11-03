import { css } from '@allenai/varnish-panda-runtime/css';

import { ImageSpinner } from '@/components/ImageSpinner';

import { PromptTemplateList, type PromptTemplateListProps } from './PromptTemplateList';

type PromptTemplateAndSpinnerProps = {
    agentId?: PromptTemplateListProps['agentId'];
    promptTemplates?: PromptTemplateListProps['promptTemplates'];
    isLoading?: boolean;
};

export const PromptTemplatesAndSpinner = ({
    agentId,
    promptTemplates,
    isLoading,
}: PromptTemplateAndSpinnerProps) => {
    if (isLoading || agentId == null || !promptTemplates?.length) {
        return (
            <div
                className={css({
                    display: 'flex',
                    flex: '1',
                    height: '[100%]',
                    justifyContent: 'center',
                })}>
                <ImageSpinner
                    src="/ai2-monogram.svg"
                    isAnimating={isLoading}
                    width={70}
                    height={70}
                    marginTop={40}
                    alt=""
                    marginBlock="auto" // maybe
                />
            </div>
        );
    }

    return <PromptTemplateList agentId={agentId} promptTemplates={promptTemplates} />;
};
