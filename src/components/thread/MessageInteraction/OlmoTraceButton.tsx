/**
 * A context-aware toggle button for showing or hiding OLMoTrace results for a given message.
 *
 * The `OlmoTraceButton` integrates with the app's thread view, feature toggles, analytics,
 * and one-time hints system to conditionally render a `FeatureToggleButton` that opens or
 * closes attribution data for a selected message.
 *
 * Key behaviors:
 * - Renders only when the "corpus link" feature toggle is enabled and the current page is not
 *   the comparison view.
 * - Selected state (`selected` prop) reflects whether this `messageId` matches the
 *   `selectedMessageId` in app state.
 * - Clicking toggles selection:
 *   - When selecting: sets the URL's `PARAM_SELECTED_MESSAGE`, updates app state, optionally
 *     opens the attribution drawer (desktop only), and dismisses the one-time hint.
 *   - When deselecting: clears the selection from state and URL.
 * - Fires `analyticsClient.trackPromptOlmoTrace` with the selected model ID whenever toggled.
 * - Uses `useOneTimeHint` to show a dismissible hint (`DismissibleHint`) the first time the
 *   user encounters the button.
 * - On desktop, hint content is passed to the `FeatureToggleButton` as a tooltip.
 * - On mobile, the hint can be shown inline via `mobileTooltip` and controlled with state when
 *   this is the "last" button in a list (`isLastButton`).
 *
 * Props:
 * - messageId: The ID of the message this toggle controls.
 * - isLastButton: Whether this is the final button in a sequence, used to control mobile
 *   tooltip behavior.
 *
 * Common usage inside a thread view:
 * <OlmoTraceButton messageId={msg.id} isLastButton={idx === lastIndex} />
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

const OlmotraceHint = ({ onClose }: { onClose: () => void }) => (
    <DismissibleHint
        onClose={onClose}
        content="Curious about how this response matches the model's training data? Click this to dig deeper."
    />
);
interface OlmoTraceButtonProps {
    messageId: FlatMessage['id'];
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
