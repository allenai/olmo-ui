import ArrowCircleDownOutlinedIcon from '@mui/icons-material/ArrowCircleDownOutlined';
import { IconButton } from '@mui/material';

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
            sx={{
                visibility: isVisible ? 'visible' : 'hidden',
                color: (theme) => theme.palette.text.secondary,
            }}
            aria-label="Scroll to bottom">
            <ArrowCircleDownOutlinedIcon sx={{ width: '36px', height: '36px' }} />
        </IconButton>
    );
};
