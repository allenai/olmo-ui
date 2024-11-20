import { IconButton } from '@mui/material';

import { DownToBottomArrowIcon } from '@/components/assets/DownToBottomArrowIcon';
import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';

interface ScrollToBottomButtonProps {
    isVisible: boolean;
    onScrollToBottom: () => void;
}

export const ScrollToBottomButton = ({
    isVisible,
    onScrollToBottom,
}: ScrollToBottomButtonProps) => {
    return (
        <IconButton
            onClick={onScrollToBottom}
            sx={(theme) => ({
                position: 'absolute',
                right: '30px',
                bottom: '26px',
                visibility: isVisible ? 'visible' : 'hidden',
                color: theme.palette.text.secondary,
                display: 'none',
                [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
                    display: 'block',
                },
            })}
            aria-label="Scroll to bottom">
            <DownToBottomArrowIcon sx={{ fill: (theme) => theme.palette.primary.main }} />
        </IconButton>
    );
};
