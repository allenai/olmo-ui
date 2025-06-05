import Article from '@mui/icons-material/Article';
import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { alpha, Button, IconButton, Stack, Typography } from '@mui/material';
import { ReactNode, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { FlatMessage } from '@/api/playgroundApi/message';
import { useAppContext } from '@/AppContext';
import { useDesktopOrUp } from '@/components/dolma/shared';
import { StyledTooltip } from '@/components/StyledTooltip';
import { useFeatureToggles } from '@/FeatureToggleContext';

import { PARAM_SELECTED_MESSAGE } from '../ThreadDisplay/selectedThreadPageLoader';

interface SelectMessageButtonProps {
    messageId: FlatMessage['id'];
    isLastButton?: boolean;
}

const HAS_EXPOSED_OLMOTRACE_KEY = 'has_exposed_olmotrace';

const OlmotraceHint = ({ onClose }: { onClose: () => void }) => {
    const tooltipContent =
        "Curious about how this response matches the model's training data? Click this to dig deeper.";
    return (
        <Stack direction="row" p={0.5}>
            <Typography variant="body2" pr={2}>
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
    const [searchParams, setSearchParams] = useSearchParams();
    const isMessageSelected = useAppContext(
        (state) => state.attribution.selectedMessageId === messageId
    );
    const selectMessage = useAppContext((state) => state.selectMessage);
    const unselectMessage = useAppContext((state) => state.unselectMessage);
    const openDrawer = useAppContext((state) => state.openDrawer);
    const selectedModelId = useAppContext((state) => state.selectedModel?.id);
    const isDesktop = useDesktopOrUp();
    const { isCorpusLinkEnabled } = useFeatureToggles();
    const [isHintVisible, setIsHintVisible] = useState(
        !localStorage.getItem(HAS_EXPOSED_OLMOTRACE_KEY)
    );
    // The last mobile tooltip has an independent variable for controlling
    // the state of the tooltip for showing showHideText after the hint is closed
    const [isLastMobileTooltipOpen, setIsLastMobileTooltipOpen] = useState(
        isLastButton && isHintVisible
    );

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
            searchParams.delete(PARAM_SELECTED_MESSAGE);
        } else {
            selectMessage(messageId);
            searchParams.set(PARAM_SELECTED_MESSAGE, messageId);

            if (isDesktop) {
                openDrawer('attribution');
            }
            // close the hint as the user has tried the olmotrace feature
            onCloseHint();
        }

        setSearchParams(searchParams, { preventScrollReset: true, replace: true });
        if (selectedModelId !== undefined) {
            analyticsClient.trackPromptOlmoTrace(selectedModelId, !isMessageSelected);
        }
    };

    const showHideText = isMessageSelected ? 'Hide OLMoTrace' : 'Show OLMoTrace';
    // We only want to show OlmotraceHint on the last button
    const showHint = isHintVisible && isLastButton;
    const mobileTooltip = showHint ? <OlmotraceHint onClose={onCloseHint} /> : showHideText;

    const lastMobileTooltipProps = isLastButton
        ? {
              open: isLastMobileTooltipOpen,
              onOpen: () => {
                  setIsLastMobileTooltipOpen(true);
              },
              onClose: () => {
                  if (!isHintVisible) {
                      setIsLastMobileTooltipOpen(false);
                  }
              },
          }
        : {};

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
        <StyledTooltip title={mobileTooltip} placement="top" {...lastMobileTooltipProps}>
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
