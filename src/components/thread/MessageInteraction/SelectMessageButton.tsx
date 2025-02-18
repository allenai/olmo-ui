import Article from '@mui/icons-material/Article';
import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import { Button } from '@mui/material';
import { ReactNode } from 'react';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { Message } from '@/api/Message';
import { useAppContext } from '@/AppContext';
import { useDesktopOrUp } from '@/components/dolma/shared';
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
    const selectedModelId = useAppContext((state) => state.selectedModel?.id);

    const isDesktop = useDesktopOrUp();

    const handleClick = () => {
        if (isMessageSelected) {
            unselectMessage(messageId);
        } else {
            selectMessage(messageId);
            if (isDesktop) {
                openDrawer('attribution');
            }
        }
        if (selectedModelId !== undefined) {
            analyticsClient.trackPromptCorpusLink(selectedModelId, !isMessageSelected);
        }
    };

    const { isCorpusLinkEnabled } = useFeatureToggles();

    if (!isCorpusLinkEnabled) {
        return null;
    }

    const showHideText = isMessageSelected ? 'Hide training text' : 'Match training text';

    if (isDesktop) {
        return (
            <Button
                onClick={handleClick}
                sx={{
                    alignSelf: 'end',
                    marginInlineStart: 4.5,
                    fontWeight: 'semiBold',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.04)' },
                }}>
                {showHideText}
            </Button>
        );
    }

    return (
        <MessageInteractionIcon
            onClick={handleClick}
            tooltip={showHideText}
            Icon={isMessageSelected ? Article : ArticleOutlined}
            selected={isMessageSelected}
        />
    );
};
