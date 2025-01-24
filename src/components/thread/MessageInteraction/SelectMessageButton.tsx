import Article from '@mui/icons-material/Article';
import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import { useMediaQuery, useTheme } from '@mui/material';
import { ReactNode } from 'react';

import { Message } from '@/api/Message';
import { useAppContext } from '@/AppContext';
import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';
import { useFeatureToggles } from '@/FeatureToggleContext';

import { MessageInteractionIcon } from './MessageInteractionIcon';

interface SelectMessageButtonProps {
    messageId: Message['id'];
}

export const SelectMessageButton = ({ messageId }: SelectMessageButtonProps): ReactNode => {
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

    const { isCorpusLinkEnabled } = useFeatureToggles();

    if (!isCorpusLinkEnabled) {
        return null;
    }

    return (
        <MessageInteractionIcon
            onClick={handleClick}
            tooltip={showSelectedIcon ? 'Hide training text' : 'Match training text'}
            Icon={showSelectedIcon ? Article : ArticleOutlined}
            selected={showSelectedIcon}
        />
    );
};
