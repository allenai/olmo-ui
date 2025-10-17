import { cva } from '@allenai/varnish-panda-runtime/css';

import { PromptTemplate, PromptTemplateProps } from './PromptTemplate';

const promptTemplateList = cva({
    base: {
        display: 'grid',

        gridAutoRows: '[1fr]', // I think panda has this typed wrong, says `fr` allowed, I assume `(\d+)fr`?
        gap: '3',
    },
    variants: {
        sampleType: {
            text: {
                gridTemplateColumns: 'repeat(2, 1fr)',
            },
            image: {
                gridTemplateColumns: 'repeat(3, 1fr)',
            },
        },
    },
    defaultVariants: {
        sampleType: 'text',
    },
});

interface PromptTemplateListProps {
    templates: Omit<PromptTemplateProps, 'sampleType'>[];
    sampleType: PromptTemplateProps['sampleType'];
}

export const PromptTemplateList = ({ templates, sampleType }: PromptTemplateListProps) => {
    return (
        <div className={promptTemplateList({ sampleType })}>
            {templates.map(({ templateId, templateText, templateImage }) => (
                <PromptTemplate
                    key={templateId}
                    templateId={templateId}
                    templateText={templateText}
                    templateImage={templateImage}
                    sampleType={sampleType}
                />
            ))}
        </div>
    );
};

/*

WIP

example, 

<PromptTemplateList
    sampleType={selectedModel?.id === 'molmo-modal-vllm' ? 'image' : 'text'}
    templates={[
        {
            templateId: '1',
            templateText: 'Sample prompt here',
            templateImage:
                selectedModel?.id === 'molmo-modal-vllm'
                    ? 'https://picsum.photos/seed/1/130/95'
                    : undefined,
        },
        {
            templateId: '2',
            templateText: 'Another example of something someone might try',
            templateImage:
                selectedModel?.id === 'molmo-modal-vllm'
                    ? 'https://picsum.photos/seed/2/130/95'
                    : undefined,
        },
        {
            templateId: '3',
            templateText: 'Hey OLMo, tell me how do to this thing',
            templateImage:
                selectedModel?.id === 'molmo-modal-vllm'
                    ? 'https://picsum.photos/seed/3/130/95'
                    : undefined,
        },
        selectedModel?.id !== 'molmo-modal-vllm'
            ? {
                  templateId: '4',
                  templateText: 'You know what I’ve always wondered about?',
              }
            : undefined,
    ].filter(Boolean)}
/>

*