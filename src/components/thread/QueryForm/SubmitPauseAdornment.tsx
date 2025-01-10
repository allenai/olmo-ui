import { Send } from '@mui/icons-material';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import { UIEvent } from 'react';

import { QueryFormButton } from './QueryFormButton';

interface SubmitPauseAdornmentProps {
    canPause?: boolean;
    onPause: (event: UIEvent) => void;
    isSubmitDisabled?: boolean;
}

export const SubmitPauseAdornment = ({
    canPause,
    onPause,
    isSubmitDisabled,
}: SubmitPauseAdornmentProps) => {
    if (canPause) {
        return (
            <QueryFormButton
                sx={{ color: 'secondary.main' }}
                aria-label="Stop response generation"
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === 'Space') {
                        event.preventDefault();
                        event.stopPropagation();
                        onPause(event);
                    }
                }}
                onClick={(event) => {
                    onPause(event);
                }}>
                <StopCircleOutlinedIcon />
            </QueryFormButton>
        );
    }

    return (
        <QueryFormButton
            sx={{ color: 'secondary.main' }}
            type="submit"
            aria-label="Submit prompt"
            disabled={isSubmitDisabled}>
            <Send />
        </QueryFormButton>
    );
};
