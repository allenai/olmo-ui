import Article from '@mui/icons-material/Article';
import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import { useMediaQuery, useTheme } from '@mui/material';

import { Message } from '@/api/Message';
import { useAppContext } from '@/AppContext';
import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';

import { MessageInteractionIcon } from './MessageInteractionIcon';

interface SelectMessageButtonProps {
    messageId: Message['id'];
}

export const SelectMessageButton = ({ messageId }: SelectMessageButtonProps) => {
    const isMessageSelected = useAppContext(
        (state) => state.attribution.selectedMessageId === messageId
    );
    const selectMessage = useAppContext((state) => state.selectMessage);
    const unselectMessage = useAppContext((state) => state.unselectMessage);
    const openDrawer = useAppContext((state) => state.openDrawer);
    const isAttributionDrawerOpen = useAppContext(
        (state) => state.currentOpenDrawer === 'attribution'
    );
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT));

    const handleClick = () => {
        if (isMessageSelected && isAttributionDrawerOpen) {
            unselectMessage(messageId);
        } else {
            selectMessage(messageId);
            if (isDesktop) {
                openDrawer('attribution');
            }
        }
    };

    const showSelectedIcon = isMessageSelected && isAttributionDrawerOpen;

    return (
        <MessageInteractionIcon
            onClick={handleClick}
            tooltip={showSelectedIcon ? 'Hide training text' : 'Match training text'}
            Icon={showSelectedIcon ? Article : ArticleOutlined}
            selected={showSelectedIcon}
        />
    );
};
