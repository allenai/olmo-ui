import { LoadingSpinner } from '@allenai/varnish-ui';
import { ContentCopy } from '@mui/icons-material';

import { SchemaToolCall } from '@/api/playgroundApi/playgroundApiSchema';
import { useAppContext } from '@/AppContext';
import { IconButtonWithTooltip } from '@/components/IconButtonWithTooltip';
import { CollapsibleWidgetContent } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetContent';
import { SnackMessageType } from '@/slices/SnackMessageSlice';
import { hstack } from '@/styled-system/patterns';

import { ToolCallCodeBlock } from './ToolCallCodeBlock';
import { ToolCallUserResponse } from './ToolCallUserResponse';

interface ToolCallResultProps {
    toolCallId: SchemaToolCall['toolCallId'];
    toolSource: SchemaToolCall['toolSource'];
    answer?: string;
}

export const ToolCallResult = ({ toolCallId, toolSource, answer }: ToolCallResultProps) => {
    const addSnackMessage = useAppContext((state) => state.addSnackMessage);
    const copyAnswer = async () => {
        if (answer) {
            await navigator.clipboard.writeText(answer);
            addSnackMessage({
                type: SnackMessageType.Brief,
                id: 'tool-call-answer-copied',
                message: 'Tool call answer copied',
            });
        }
    };

    const isPendingAnswer = answer == null;

    if (toolSource === 'user_defined' && isPendingAnswer) {
        return <ToolCallUserResponse toolCallId={toolCallId} />;
    }

    return (
        <CollapsibleWidgetContent
            contrast="medium"
            className={hstack({ justifyContent: 'space-between' })}>
            {isPendingAnswer ? <LoadingSpinner /> : <ToolCallCodeBlock>{answer}</ToolCallCodeBlock>}
            <IconButtonWithTooltip
                disabled={isPendingAnswer}
                label="Copy tool call answer"
                onClick={copyAnswer}
                color="default"
                placement="top">
                <ContentCopy />
            </IconButtonWithTooltip>
        </CollapsibleWidgetContent>
    );
};
