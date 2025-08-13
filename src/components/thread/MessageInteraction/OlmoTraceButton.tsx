/**
 * A context-aware toggle button for showing or hiding OLMoTrace results for a given message.
 * Integrates with the thread view, feature toggles, analytics, and a one-time hints system to
 * conditionally render a `FeatureToggleButton` that opens or closes attribution data.
 *
 * @example
 * <OlmoTraceButton messageId={msg.id} isLastButton={idx === lastIndex} />
 *
 * @param {OlmoTraceButtonProps} props - Component props.
 * @returns {JSX.Element} The rendered button.
 */

import Article from '@mui/icons-material/Article';
import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import { ReactNode, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { FlatMessage } from '@/api/playgroundApi/thread';
import { useAppContext } from '@/AppContext';
import { useDesktopOrUp } from '@/components/dolma/shared';
import { useFeatureToggles } from '@/FeatureToggleContext';
import { useSelectedModel, useThreadView } from '@/pages/comparison/ThreadViewContext';

import { PARAM_SELECTED_MESSAGE } from '../ThreadDisplay/selectedThreadPageLoader';
import { DismissibleHint } from './DismissibleHint';
import { FeatureToggleButton } from './FeatureToggleButton';
import { useOneTimeHint } from './useOneTimeHint';

const HAS_EXPOSED_OLMOTRACE_KEY = 'has_exposed_olmotrace';

/**
 * Props for the {@link OlmoTraceButton} component.
 */
interface OlmoTraceButtonProps {
    /** The ID of the message this toggle controls. */
    messageId: FlatMessage['id'];

    /**
     * Whether this is the final button in a list, used to adjust mobile tooltip behavior
     * (e.g., allow controlled inline hint on the last item).
     */
    isLastButton?: boolean;
}

export const OlmoTraceButton = ({
    messageId,
    isLastButton = false,
}: OlmoTraceButtonProps): ReactNode => {
    const { visible: isHintVisible, dismiss: onCloseHint } =
        useOneTimeHint(HAS_EXPOSED_OLMOTRACE_KEY);
    const { threadId } = useThreadView();
    const [searchParams, setSearchParams] = useSearchParams();
    const isMessageSelected = useAppContext(
        (state) => state.attribution.selectedMessageId === messageId
    );
    const selectMessage = useAppContext((state) => state.selectMessage);
    const unselectMessage = useAppContext((state) => state.unselectMessage);
    const openDrawer = useAppContext((state) => state.openDrawer);

    const model = useSelectedModel();
    const selectedModelId = model?.id;

    const isDesktop = useDesktopOrUp();
    const { isCorpusLinkEnabled } = useFeatureToggles();
    const location = useLocation();
    const isOnComparisonPage = location.pathname.startsWith('/comparison');

    const [isLastMobileTooltipOpen, setIsLastMobileTooltipOpen] = useState(
        isLastButton && isHintVisible
    );

    if (!isCorpusLinkEnabled || isOnComparisonPage) {
        return null;
    }

    const handleChange = (next: boolean) => {
        if (!next) {
            unselectMessage(messageId);
            searchParams.delete(PARAM_SELECTED_MESSAGE);
        } else {
            selectMessage(threadId, messageId);
            searchParams.set(PARAM_SELECTED_MESSAGE, messageId);
            if (isDesktop) {
                openDrawer('attribution');
            }
            onCloseHint();
        }

        setSearchParams(searchParams, { preventScrollReset: true, replace: true });
    };

    const handleTrack = (next: boolean) => {
        if (selectedModelId !== undefined) {
            analyticsClient.trackPromptOlmoTrace(selectedModelId, next);
        }
    };

    const showHideText = isMessageSelected ? 'Hide OLMoTrace' : 'Show OLMoTrace';
    const showHint = isHintVisible && isLastButton;

    return (
        <FeatureToggleButton
            selected={isMessageSelected}
            onChange={handleChange}
            onTrack={handleTrack}
            labelOn="Hide OLMoTrace"
            labelOff="Show OLMoTrace"
            iconOn={<Article />}
            iconOff={<ArticleOutlined />}
            hint={<OlmotraceHint onClose={onCloseHint} />}
            showHint={showHint}
            mobileTooltip={showHint ? <OlmotraceHint onClose={onCloseHint} /> : showHideText}
            mobileTooltipOpen={isLastButton ? isLastMobileTooltipOpen : undefined}
            onMobileTooltipOpenChange={
                isLastButton
                    ? (open) => {
                          if (open) {
                              setIsLastMobileTooltipOpen(true);
                          } else if (!isHintVisible) {
                              setIsLastMobileTooltipOpen(false);
                          }
                      }
                    : undefined
            }
            buttonProps={{ sx: { padding: 1 } }}
        />
    );
};

/**
 * A small wrapper component that renders a {@link DismissibleHint} with
 * pre-defined OLMoTrace hint text.
 *
 * @example
 * <OlmotraceHint onClose={() => setShowHint(false)} />
 *
 * @param {{ onClose: () => void }} props - Component props.
 * @param {() => void} props.onClose - Callback fired when the hint is dismissed.
 * @returns {JSX.Element} The rendered dismissible hint.
 */
const OlmotraceHint = ({ onClose }: { onClose: () => void }) => (
    <DismissibleHint
        onClose={onClose}
        content="Curious about how this response matches the model's training data? Click this to dig deeper."
    />
);
