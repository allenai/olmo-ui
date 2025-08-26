import { css } from '@allenai/varnish-panda-runtime/css';
import { ContentCopy } from '@mui/icons-material';

import { useAppContext } from '@/AppContext';
import { IconButtonWithTooltip } from '@/components/IconButtonWithTooltip';
import { ThemeSyntaxHighlighter } from '@/components/ThemeSyntaxHighlighter';
import { CollapsibleWidgetContent } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetContent';
import { SnackMessageType } from '@/slices/SnackMessageSlice';

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

    if (children.length === 0) {
        return null;
    }

    return (
        <CollapsibleWidgetContent contrast="medium">
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
        </CollapsibleWidgetContent>
    );
};
