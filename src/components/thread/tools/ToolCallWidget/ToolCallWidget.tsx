import { ContentCopy, DataObject } from '@mui/icons-material';

import type { SchemaToolCall } from '@/api/playgroundApi/playgroundApiSchema';
import { useAppContext } from '@/AppContext';
import { IconButtonWithTooltip } from '@/components/IconButtonWithTooltip';
import { CollapsibleWidgetBase } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetBase';
import { CollapsibleWidgetFooter } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetFooter';
import { CollapsibleWidgetHeading } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetHeading';
import { CollapsibleWidgetPanel } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetPanel';
import { ExpandArrow } from '@/components/widgets/CollapsibleWidget/ExpandArrow';
import { FadeOverflowContent } from '@/components/widgets/FadeOverflowContent';
import { SnackMessageType } from '@/slices/SnackMessageSlice';
import { css } from '@/styled-system/css';

import { mapToolCallArgs } from '../mapToolCallArgs';
import { ToolCallAnswer } from './ToolCallAnswer';
import { ToolCallParameters } from './ToolCallContent';

interface ToolCallWidgetProps {
    toolCall: SchemaToolCall;
    answer?: string;
}

export const ToolCallWidget = ({ toolCall, answer }: ToolCallWidgetProps) => {
    const mappedArgs = mapToolCallArgs(toolCall);
    const stringArgs = JSON.stringify(mappedArgs, undefined, 2);

    const addSnackMessage = useAppContext((state) => state.addSnackMessage);

    const copyParameters = async () => {
        await navigator.clipboard.writeText(stringArgs);
        addSnackMessage({
            type: SnackMessageType.Brief,
            id: 'tool-call-args-copied',
            message: 'Tool call parameters copied',
        });
    };
    return (
        <CollapsibleWidgetBase defaultExpanded>
            <CollapsibleWidgetHeading
                aria-label={`tool call ${toolCall.toolName}`}
                startAdornment={<DataObject titleAccess="Tool call" />}
                endAdornment={<ExpandArrow />}>
                {toolCall.toolName}
            </CollapsibleWidgetHeading>
            <CollapsibleWidgetPanel>
                <FadeOverflowContent className={css({ width: '[100%]' })}>
                    <ToolCallParameters>{stringArgs}</ToolCallParameters>
                    <CollapsibleWidgetFooter>
                        <IconButtonWithTooltip
                            label="Copy tool call parameters"
                            onClick={copyParameters}
                            color="default"
                            placement="top"
                            edge="start">
                            <ContentCopy />
                        </IconButtonWithTooltip>
                    </CollapsibleWidgetFooter>
                    <ToolCallAnswer>{answer}</ToolCallAnswer>
                </FadeOverflowContent>
            </CollapsibleWidgetPanel>
        </CollapsibleWidgetBase>
    );
};
