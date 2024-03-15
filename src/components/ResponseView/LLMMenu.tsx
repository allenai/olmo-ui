import { useAppContext } from 'src/AppContext';
import CropSquareIcon from '@mui/icons-material/CropSquare';

import { HideAndShowContainer, StopButton } from './Response';

interface MenuProps {
    branchMenu?: JSX.Element;
    contextMenu?: JSX.Element;
    hover: boolean;
    onAbort: () => void;
    msgId: string;
}

export const LLMMenu = ({ msgId, contextMenu, branchMenu, hover, onAbort }: MenuProps) => {
    const abortController = useAppContext((state) => state.abortController);
    const ongoingThreadId = useAppContext((state) => state.ongoingThreadId);
    if (abortController && ongoingThreadId === msgId) {
        return (
            <StopButton variant="outlined" startIcon={<CropSquareIcon />} onClick={onAbort}>
                Stop
            </StopButton>
        );
    }

    return (
        <HideAndShowContainer direction="row" spacing={1} show={hover ? 'true' : 'false'}>
            {contextMenu || null}
            {branchMenu || null}
        </HideAndShowContainer>
    );
};
