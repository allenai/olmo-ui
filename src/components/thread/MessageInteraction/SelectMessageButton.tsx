import Article from '@mui/icons-material/Article';
import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import { Button } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { Message } from '@/api/Message';
import { useAppContext } from '@/AppContext';
import { useDesktopOrUp } from '@/components/dolma/shared';
import { StyledTooltip } from '@/components/StyledTooltip';
import { useFeatureToggles } from '@/FeatureToggleContext';

import { MessageInteractionIcon } from './MessageInteractionIcon';

interface SelectMessageButtonProps {
    messageId: Message['id'];
}

const EXPOSED_BROWSER_IDS_KEY = 'tried_olmotrace_browser_ids';

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
    const [showOlmotrace, setShowOlmotrace] = useState(false);

    useEffect(() => {
        const exposedBrowserIds = (localStorage.getItem(EXPOSED_BROWSER_IDS_KEY) || '').split('&');
        const currentUA = navigator.userAgent.toLowerCase();
        const hasExposed = !!exposedBrowserIds.find((browserId) => browserId === currentUA);

        if (!hasExposed) {
            exposedBrowserIds.push(currentUA);
            localStorage.setItem(EXPOSED_BROWSER_IDS_KEY, exposedBrowserIds.join('&'));
            setShowOlmotrace(true);
        }
    }, []);

    if (!isCorpusLinkEnabled) {
        return null;
    }

    const showHideText = isMessageSelected ? 'Hide OLMoTrace' : 'Show OLMoTrace';

    if (isDesktop) {
        return (
            // <Button startIcon={} sizes the icon to 20px regardless of what size you set
            // this acheives a similar result, while allowing our Icon size to match an <IconButton>
            <StyledTooltip title="Try OlmoTrace" placement="top" open={showOlmotrace}>
                <Button
                    variant="text"
                    onClick={handleClick}
                    sx={{
                        fontWeight: 'semiBold',
                        color: 'primary.main',
                        gap: 1,
                        padding: 1,
                        '&:hover': {
                            color: 'text.primary',
                            backgroundColor: (theme) =>
                                // I don't know why this comes for free with IconButton, but not Button
                                theme.palette.mode === 'dark'
                                    ? 'rgba(255,255,255,0.04)'
                                    : 'rgba(0,0,0,0.04)',
                        },
                    }}>
                    {isMessageSelected ? <Article /> : <ArticleOutlined />}
                    <span>{showHideText}</span>
                </Button>
            </StyledTooltip>
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
