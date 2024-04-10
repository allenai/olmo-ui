import { Message } from 'src/api/Message';
import { KeyboardArrowDown } from '@mui/icons-material';
import { MenuItem, Typography } from '@mui/material';

import { MessageActionsMenu } from '../MessageActionsMenu';

interface BranchMenuProps {
    setBranchMenuAnchorEl: (anchor: null | HTMLElement) => void;
    branchMenuAnchorEl: HTMLElement | null;
    messages: Message[];
    curMessageIndex: number;
    handleBranchMenuSelect: (index: number) => void;
}

export const BranchMenu = ({
    setBranchMenuAnchorEl,
    branchMenuAnchorEl,
    messages,
    curMessageIndex,
    handleBranchMenuSelect,
}: BranchMenuProps) => {
    const branchCount = messages.length;
    return (
        <MessageActionsMenu
            setMenuAnchorEl={setBranchMenuAnchorEl}
            menuAnchorEl={branchMenuAnchorEl}
            startIcon={<KeyboardArrowDown />}
            label={`View ${branchCount} branches`}>
            {messages.map((msg, i) => (
                <MenuItem
                    key={i}
                    onClick={() => {
                        handleBranchMenuSelect(i);
                    }}
                    selected={i === curMessageIndex}
                    title={msg.snippet}>
                    <Typography variant="inherit" noWrap>
                        {msg.snippet}
                    </Typography>
                </MenuItem>
            ))}
        </MessageActionsMenu>
    );
};
