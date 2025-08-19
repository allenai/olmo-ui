import type { SchemaToolCall } from '@/api/playgroundApi/playgroundApiSchema';
import { CollapsibleWidgetBase } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetBase';
import { CollapsibleWidgetHeading } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetHeading';
import { CollapsibleWidgetPanel } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetPanel';
import { ExpandArrow } from '@/components/widgets/CollapsibleWidget/ExpandArrow';
import { FadeOverflowContent } from '@/components/widgets/FadeOverflowContent';
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
    return (
        <CollapsibleWidgetBase defaultExpanded>
            <CollapsibleWidgetHeading endAdornment={<ExpandArrow />}>
                {toolCall.toolName}
            </CollapsibleWidgetHeading>
            <CollapsibleWidgetPanel>
                <FadeOverflowContent className={css({ width: '[100%]' })}>
                    <ToolCallParameters>
                        {JSON.stringify(mappedArgs, undefined, 2)}
                    </ToolCallParameters>
                    <ToolCallAnswer>{answer}</ToolCallAnswer>
                </FadeOverflowContent>
            </CollapsibleWidgetPanel>
        </CollapsibleWidgetBase>
    );
};
