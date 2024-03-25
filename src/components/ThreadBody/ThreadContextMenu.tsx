import { LabelRating } from 'src/api/Label';
import { Message } from 'src/api/Message';

import { MoreHoriz } from '@mui/icons-material';

import { MessageActionsMenu, MessageContextMenu } from '../MessageActionsMenu';

interface ThreadContextMenuProps {
    setContextMenuAnchorEl: (anchor: null | HTMLElement) => void;
    contextMenuAnchorEl: HTMLElement | null;
    isLoading: boolean;
    disabledActions: boolean;
    handleEdit: () => void;
    addLabel: (rating: LabelRating, id: string, msg: Message) => Promise<void>;
    curMessage: Message;
}

export const ThreadContextMenu = ({
    setContextMenuAnchorEl,
    contextMenuAnchorEl,
    isLoading,
    disabledActions,
    handleEdit,
    addLabel,
    curMessage,
}: ThreadContextMenuProps) => {
    return (
        <MessageActionsMenu
            setMenuAnchorEl={setContextMenuAnchorEl}
            menuAnchorEl={contextMenuAnchorEl}
            primaryIcon={<MoreHoriz />}
            disabled={isLoading || disabledActions}>
            <MessageContextMenu
                handleEdit={handleEdit}
                addLabel={addLabel}
                curMessage={curMessage}
            />
        </MessageActionsMenu>
    );
};
