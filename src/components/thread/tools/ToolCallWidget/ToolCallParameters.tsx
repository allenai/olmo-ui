import { ContentCopy } from '@mui/icons-material';

import { useAppContext } from '@/AppContext';
import { IconButtonWithTooltip } from '@/components/IconButtonWithTooltip';
import { ThemeSyntaxHighlighter } from '@/components/ThemeSyntaxHighlighter';
import { CollapsibleWidgetPanelContent } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetPanel';
import { SnackMessageType } from '@/slices/SnackMessageSlice';
import { css } from '@/styled-system/css';

interface ToolCallParametersProps {
    // Not using the optional ? here ensures that children are passed
    children: string | undefined;
}

export const ToolCallParameters = ({ children = '' }: ToolCallParametersProps) => {
    const addSnackMessage = useAppContext((state) => state.addSnackMessage);
    const copyParameters = async () => {
        if (children) {
            await navigator.clipboard.writeText(children);
            addSnackMessage({
                type: SnackMessageType.Brief,
                id: 'tool-call-answer-copied',
                message: 'Tool call parameters copied',
            });
        }
    };

    return (
        <CollapsibleWidgetPanelContent>
            <div className={css({ position: 'relative' })}>
                <IconButtonWithTooltip
                    label="Copy tool call parameters"
                    color="default"
                    placement="top"
                    onClick={copyParameters}
                    sx={{
                        position: 'absolute',
                        right: '0',
                    }}>
                    <ContentCopy />
                </IconButtonWithTooltip>
                <ThemeSyntaxHighlighter
                    customStyle={{ margin: 0, padding: 0, backgroundColor: 'transparent' }}>
                    {children}
                </ThemeSyntaxHighlighter>
            </div>
        </CollapsibleWidgetPanelContent>
    );
};
