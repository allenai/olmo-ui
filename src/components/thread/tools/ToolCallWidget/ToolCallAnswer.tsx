import { ContentCopy } from '@mui/icons-material';

import { useAppContext } from '@/AppContext';
import { ThemeSyntaxHighlighter } from '@/components/ThemeSyntaxHighlighter';
import { MessageInteractionIcon } from '@/components/thread/MessageInteraction/MessageInteractionIcon';
import { CollapsibleWidgetFooter } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetFooter';
import { CollapsibleWidgetPanelContent } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetPanel';
import { SnackMessageType } from '@/slices/SnackMessageSlice';
import { hstack } from '@/styled-system/patterns';

type ToolCallAnswerProps = {
    children: string | undefined;
};

export const ToolCallAnswer = ({ children = '' }: ToolCallAnswerProps) => {
    const addSnackMessage = useAppContext((state) => state.addSnackMessage);
    const copyAnswer = async () => {
        if (children) {
            await navigator.clipboard.writeText(children);
            addSnackMessage({
                type: SnackMessageType.Brief,
                id: 'tool-call-answer-copied',
                message: 'Tool call answer copied',
            });
        }
    };

    return (
        <>
            <CollapsibleWidgetFooter className={hstack({ justifyContent: 'space-between' })}>
                <MessageInteractionIcon
                    tooltip="Copy tool call parameters"
                    Icon={ContentCopy}
                    onClick={copyAnswer}
                />
                Tool call
            </CollapsibleWidgetFooter>
            <CollapsibleWidgetPanelContent className={hstack()}>
                <MessageInteractionIcon
                    tooltip="Copy tool call answer"
                    Icon={ContentCopy}
                    onClick={copyAnswer}
                />
                <ThemeSyntaxHighlighter
                    customStyle={{ margin: 0, padding: 0, backgroundColor: 'transparent' }}>
                    {children}
                </ThemeSyntaxHighlighter>
            </CollapsibleWidgetPanelContent>
        </>
    );
};
