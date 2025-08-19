import { DataObject } from '@mui/icons-material';

import type { SchemaToolCall } from '@/api/playgroundApi/playgroundApiSchema';
import { CollapsibleWidgetBase } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetBase';
import { CollapsibleWidgetFooter } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetFooter';
import { CollapsibleWidgetHeading } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetHeading';
import { CollapsibleWidgetPanel } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetPanel';
import { ExpandArrow } from '@/components/widgets/CollapsibleWidget/ExpandArrow';
import { FadeOverflowContent } from '@/components/widgets/FadeOverflowContent';
import { css } from '@/styled-system/css';

import { mapToolCallArgs } from '../mapToolCallArgs';
import { ToolCallAnswer } from './ToolCallAnswer';
import { ToolCallParameters } from './ToolCallParameters';

interface ToolCallWidgetProps {
    toolCall: SchemaToolCall;
    answer?: string;
}

export const ToolCallWidget = ({ toolCall, answer }: ToolCallWidgetProps) => {
    const mappedArgs = mapToolCallArgs(toolCall);
    const stringArgs = JSON.stringify(mappedArgs, undefined, 2);

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
                    <CollapsibleWidgetFooter></CollapsibleWidgetFooter>
                    <ToolCallAnswer>{answer}</ToolCallAnswer>
                </FadeOverflowContent>
            </CollapsibleWidgetPanel>
        </CollapsibleWidgetBase>
    );
};
