import { css } from '@allenai/varnish-panda-runtime/css';

export const PromptTemplateImage = ({
    templateImage,
    templateText,
}: {
    templateImage: string;
    templateText: string;
}) => {
    return (
        <div
            className={css({
                borderRadius: 'lg',
            })}>
            <img src={templateImage} alt={templateText} />
        </div>
    );
};
