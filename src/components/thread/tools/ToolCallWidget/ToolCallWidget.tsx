import { DataObject } from '@mui/icons-material';

import type { SchemaToolCall } from '@/api/playgroundApi/playgroundApiSchema';
import { CollapsibleWidgetBase } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetBase';
import { CollapsibleWidgetHeading } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetHeading';
import { CollapsibleWidgetPanel } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetPanel';
import { ExpandArrowButton } from '@/components/widgets/CollapsibleWidget/ExpandArrow';
import { FadeOverflowContent } from '@/components/widgets/FadeOverflowContent';

import { mapToolCallArgs } from '../mapToolCallArgs';
import { ToolCallParameters } from './ToolCallParameters';
import { ToolCallResult } from './ToolCallResult';

interface ToolCallWidgetProps {
    toolCall: SchemaToolCall;
    answer?: string;
}

export const ToolCallWidget = ({ toolCall, answer }: ToolCallWidgetProps) => {
    const mappedArgs = mapToolCallArgs(toolCall);
    const stringArgs = JSON.stringify(mappedArgs, undefined, 2);

    return (
        <CollapsibleWidgetBase defaultExpanded data-widget-type="tool-call">
            <CollapsibleWidgetHeading
                aria-label={`tool call ${toolCall.toolName}`}
                startAdornment={<DataObject />}
                endAdornment={<ExpandArrowButton />}>
                {toolCall.toolName}
            </CollapsibleWidgetHeading>
            <FadeOverflowContent contrast="low" shouldStickToBottom>
                <CollapsibleWidgetPanel>
                    <ToolCallParameters>{stringArgs}</ToolCallParameters>

                    <ToolCallResult
                        toolCallId={toolCall.toolCallId}
                        toolSource={toolCall.toolSource}
                        answer={answer}
                    />
                </CollapsibleWidgetPanel>
            </FadeOverflowContent>
        </CollapsibleWidgetBase>
    );
};
