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
        <>
            {isVisible && (
                <IconButton
                    onClick={onScrollToBottom}
                    sx={{
                        color: (theme) => theme.palette.text.secondary,
                    }}>
                    <ArrowCircleDownOutlinedIcon sx={{ width: '36px', height: '36px' }} />
                </IconButton>
            )}
        </>
    );
};
