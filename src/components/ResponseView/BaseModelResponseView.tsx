import CropSquareIcon from '@mui/icons-material/CropSquare';
import { Stack } from '@mui/material';
import DOMPurify from 'dompurify';
import { useCallback } from 'react';

import { useAppContext } from '../../AppContext';
import { RobotAvatar } from '../avatars/RobotAvatar';
import { UserAvatar } from '../avatars/UserAvatar';
import { LLMResponseContainer } from './LLMResponseView';
import { marked, ResponseProps, StopButton } from './Response';

export interface BaseResponseContainerProps {
    children: React.ReactNode;
}

const BaseResponseContainer = ({ children }: BaseResponseContainerProps) => {
    return (
        <div
            style={{ position: 'relative' }}
            role="presentation" // TODO: need a better a11y keyboard-only story pre-release
        >
            {children}
        </div>
    );
};

export const BaseModelResponseView = ({ response, msgId, initialPrompt }: ResponseProps) => {
    const abortController = useAppContext((state) => state.abortController);
    const ongoingThreadId = useAppContext((state) => state.ongoingThreadId);

    const onAbort = useCallback(() => {
        abortController?.abort();
    }, [abortController]);

    // turning off features as they pop dom warnings
    marked.use({
        mangle: false,
        headerIds: false,
    });

    const html = DOMPurify.sanitize(
        initialPrompt ? initialPrompt + marked.parse(response) : marked.parse(response)
    );

    return (
        <BaseResponseContainer>
            <Stack direction="row">
                <Stack direction="column" spacing={-1}>
                    <UserAvatar />
                    <RobotAvatar />
                </Stack>
                <LLMResponseContainer id={msgId}>
                    <Stack direction="row" justifyContent="space-between">
                        <div
                            dangerouslySetInnerHTML={{ __html: html }}
                            style={{ background: 'transparent', overflowWrap: 'anywhere' }}
                        />
                        {abortController && ongoingThreadId === msgId && (
                            <StopButton
                                variant="outlined"
                                startIcon={<CropSquareIcon />}
                                onClick={onAbort}>
                                Stop
                            </StopButton>
                        )}
                    </Stack>
                </LLMResponseContainer>
            </Stack>
        </BaseResponseContainer>
    );
};
