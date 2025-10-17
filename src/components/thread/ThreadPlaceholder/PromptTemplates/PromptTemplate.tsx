import { css, cva, RecipeVariantProps } from '@allenai/varnish-panda-runtime/css';

const promptTemplate = cva({
    base: {
        display: 'grid',
        gap: '4',
        appearance: 'none',
        backgroundColor: 'elements.overlay.background',
        padding: '4',
        borderRadius: 'lg',
        textAlign: 'left',
        fontWeight: 'medium',
        cursor: 'pointer',
    },
    variants: {
        sampleType: {
            text: {
                alignContent: 'center',
            },
            image: {
                gridTemplateRows: 'auto 1fr',
            },
        },
    },
    defaultVariants: {
        sampleType: 'text',
    },
});

const promptTemplateImageClassName = css({
    borderRadius: 'sm',
    width: '[100%]',
});

export type PromptTemplateVariants = Exclude<RecipeVariantProps<typeof promptTemplate>, undefined>;

export interface PromptTemplateProps extends PromptTemplateVariants {
    templateId: string;
    templateText: string;
    templateImage?: string;
}

export const PromptTemplate = ({
    templateId,
    templateText,
    templateImage,
    sampleType,
}: PromptTemplateProps) => {
    const handleClick = () => {
        console.log(`Load templateId: ${templateId}`);
    };

    return (
        <button onClick={handleClick} className={promptTemplate({ sampleType })}>
            {templateImage ? (
                <img
                    src={templateImage}
                    alt={templateText}
                    className={promptTemplateImageClassName}
                />
            ) : null}
            <p>{templateText}</p>
        </button>
    );
};
