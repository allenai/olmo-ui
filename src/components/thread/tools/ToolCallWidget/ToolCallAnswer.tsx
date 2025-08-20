import { ContentCopy } from '@mui/icons-material';

import { useAppContext } from '@/AppContext';
import { IconButtonWithTooltip } from '@/components/IconButtonWithTooltip';
import { ThemeSyntaxHighlighter } from '@/components/ThemeSyntaxHighlighter';
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
        <CollapsibleWidgetPanelContent
            contrast="low"
            className={hstack({ justifyContent: 'space-between' })}>
            <ThemeSyntaxHighlighter
                customStyle={{ margin: 0, padding: 0, backgroundColor: 'transparent' }}>
                {children}
            </ThemeSyntaxHighlighter>
            <IconButtonWithTooltip
                label="Copy tool call answer"
                onClick={copyAnswer}
                color="default"
                placement="top">
                <ContentCopy />
            </IconButtonWithTooltip>
        </CollapsibleWidgetPanelContent>
    );
};
