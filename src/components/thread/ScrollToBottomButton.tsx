import { css, cva } from '@allenai/varnish-panda-runtime/css';
import { IconButton } from '@allenai/varnish-ui';
import { ArrowDownward } from '@mui/icons-material';

interface ScrollToBottomButtonProps {
    isVisible: boolean;
    onScrollToBottom: () => void;
}

const containerClassName = cva({
    base: {
        zIndex: '[10]',
        position: 'sticky',
        bottom: '[0]',
        justifySelf: 'end',
        visibility: 'hidden',
    },
    variants: {
        isVisible: {
            true: {
                visibility: 'visible',
            },
        },
    },
});

const buttonClassName = css({
    border: '0',
    backgroundColor: 'dark-teal.100',
    width: '[54px]',
    height: '[54px]',
    fontSize: '[1.875rem]',
});

export const ScrollToBottomButton = ({
    isVisible,
    onScrollToBottom,
}: ScrollToBottomButtonProps) => {
    return (
        <div className={containerClassName({ isVisible })}>
            <IconButton
                onPress={onScrollToBottom}
                color="secondary"
                shape="rounded"
                size="large"
                className={buttonClassName}
                aria-label="Scroll to bottom">
                <ArrowDownward fontSize="inherit" />
            </IconButton>
        </div>
    );
};
