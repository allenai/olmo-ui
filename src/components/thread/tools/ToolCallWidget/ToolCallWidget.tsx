import { css } from '@allenai/varnish-panda-runtime/css';
import { DataObject } from '@mui/icons-material';

import type { SchemaToolCall } from '@/api/playgroundApi/playgroundApiSchema';
import { CollapsibleWidgetBase } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetBase';
import { CollapsibleWidgetHeading } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetHeading';
import { CollapsibleWidgetPanel } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetPanel';
import { ExpandArrowButton } from '@/components/widgets/CollapsibleWidget/ExpandArrow';

import { mapToolCallArgs } from '../mapToolCallArgs';
import { ToolCallAnswer } from './ToolCallAnswer';
import { ToolCallParameters } from './ToolCallParameters';

interface ToolCallWidgetProps {
    toolCall: SchemaToolCall;
    answer?: string;
}

const toolCallWidgetClassName = css({
    marginBottom: '1',
});

export const ToolCallWidget = ({ toolCall, answer }: ToolCallWidgetProps) => {
    const mappedArgs = mapToolCallArgs(toolCall);
    const stringArgs = JSON.stringify(mappedArgs, undefined, 2);

    return (
        <CollapsibleWidgetBase className={toolCallWidgetClassName} defaultExpanded>
            <CollapsibleWidgetHeading
                aria-label={`tool call ${toolCall.toolName}`}
                startAdornment={<DataObject />}
                endAdornment={<ExpandArrowButton />}>
                {toolCall.toolName}
            </CollapsibleWidgetHeading>
            <CollapsibleWidgetPanel>
                <ToolCallParameters>{stringArgs}</ToolCallParameters>
                <ToolCallAnswer>{answer}</ToolCallAnswer>
            </CollapsibleWidgetPanel>
        </CollapsibleWidgetBase>
    );
};
