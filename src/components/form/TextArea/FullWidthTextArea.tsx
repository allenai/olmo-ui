import { css, cx } from '@allenai/varnish-panda-runtime/css';
import { TextArea, type TextAreaProps } from '@allenai/varnish-ui';

const growContainerStyle = css({
    width: '[100%]',
});

const textAreaStyle = css({
    width: '[100%]',
});

type FullWidthTextAreaProps = Omit<TextAreaProps, 'growContainerClassName' | 'fullWidth'>;

export function FullWidthTextArea(props: FullWidthTextAreaProps) {
    return (
        <TextArea
            {...props}
            growContainerClassName={growContainerStyle}
            textAreaClassName={cx(textAreaStyle, props.textAreaClassName)}
        />
    );
}
