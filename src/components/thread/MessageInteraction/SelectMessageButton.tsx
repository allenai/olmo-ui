import Article from '@mui/icons-material/Article';
import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { alpha, Button, IconButton, Stack, Typography } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { Message } from '@/api/Message';
import { useAppContext } from '@/AppContext';
import { useDesktopOrUp } from '@/components/dolma/shared';
import { StyledTooltip } from '@/components/StyledTooltip';
import { useFeatureToggles } from '@/FeatureToggleContext';

interface SelectMessageButtonProps {
    messageId: Message['id'];
    isLastButton?: boolean;
}

const HAS_EXPOSED_OLMOTRACE_KEY = 'has_exposed_olmotrace';

const OlmotraceHint = ({ onClose }: { onClose: () => void }) => {
    const tooltipContent =
        "Curious about how this response matches the model's training data? Click this to dig deeper.";
    return (
        <Stack direction="row" p={0.5}>
            <Typography fontSize="0.875rem" pr={2}>
                {tooltipContent}
            </Typography>
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={(theme) => ({
                    position: 'absolute',
                    right: '0px',
                    top: '0px',
                    padding: 0.75,
                    color: theme.palette.grey[300],
                })}>
                <CloseIcon />
            </IconButton>
        </Stack>
    );
};

export const SelectMessageButton = ({
    messageId,
    isLastButton = false,
}: SelectMessageButtonProps): ReactNode => {
    const isMessageSelected = useAppContext(
        (state) => state.attribution.selectedMessageId === messageId
    );
    const selectMessage = useAppContext((state) => state.selectMessage);
    const unselectMessage = useAppContext((state) => state.unselectMessage);
    const openDrawer = useAppContext((state) => state.openDrawer);
    const selectedModelId = useAppContext((state) => state.selectedModel?.id);

    const isDesktop = useDesktopOrUp();
    const { isCorpusLinkEnabled } = useFeatureToggles();
    const [isHintVisible, setIsHintVisible] = useState(false);

    useEffect(() => {
        const hasExposedHint = Boolean(localStorage.getItem(HAS_EXPOSED_OLMOTRACE_KEY));

        if (!hasExposedHint) {
            setIsHintVisible(true);
        }
    }, []);

    if (!isCorpusLinkEnabled) {
        return null;
    }

    const onCloseHint = () => {
        setIsHintVisible(false);
        localStorage.setItem(HAS_EXPOSED_OLMOTRACE_KEY, 'true');
    };

    const handleClick = () => {
        if (isMessageSelected) {
            unselectMessage(messageId);
        } else {
            selectMessage(messageId);
            if (isDesktop) {
                openDrawer('attribution');
            }
            // close the hint as the user has tried the olmotrace feature
            onCloseHint();
        }
        if (selectedModelId !== undefined) {
            analyticsClient.trackPromptCorpusLink(selectedModelId, !isMessageSelected);
        }
    };

    const showHideText = isMessageSelected ? 'Hide OLMoTrace' : 'Show OLMoTrace';
    // We only want to show OlmotraceHint on the last button
    const showHint = isHintVisible && isLastButton;
    const mobileTooltip = showHint ? <OlmotraceHint onClose={onCloseHint} /> : showHideText;

    if (isDesktop) {
        return (
            <StyledTooltip
                title={<OlmotraceHint onClose={onCloseHint} />}
                placement="top"
                open={showHint}>
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
                                theme.palette.mode === 'dark'
                                    ? alpha(theme.palette.common.white, 0.04)
                                    : alpha(theme.palette.common.black, 0.04),
                        },
                    }}>
                    {isMessageSelected ? <Article /> : <ArticleOutlined />}
                    <span>{showHideText}</span>
                </Button>
            </StyledTooltip>
        );
    }

    return (
        <StyledTooltip title={mobileTooltip} placement="top" open={showHint || undefined}>
            <IconButton
                onClick={handleClick}
                aria-pressed={isMessageSelected}
                aria-label={typeof mobileTooltip === 'string' ? mobileTooltip : undefined}
                sx={{
                    color: 'primary.main',
                    '&:hover': {
                        color: 'text.primary',
                    },
                }}>
                {isMessageSelected ? <Article /> : <ArticleOutlined />}
            </IconButton>
        </StyledTooltip>
    );
};
