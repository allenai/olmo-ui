import type { SchemaToolCall } from '@/api/playgroundApi/playgroundApiSchema';
import { ThemeSyntaxHighlighter } from '@/components/ThemeSyntaxHighlighter';
import { CollapsibleWidgetBase } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetBase';
import { CollapsibleWidgetFooter } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetFooter';
import { CollapsibleWidgetHeading } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetHeading';
import {
    CollapsibleWidgetPanel,
    CollapsibleWidgetPanelContent,
} from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetPanel';
import { ExpandArrow } from '@/components/widgets/CollapsibleWidget/ExpandArrow';
import { FadeOverflowContent } from '@/components/widgets/FadeOverflowContent';
import { css } from '@/styled-system/css';

interface ToolCallWidgetProps {
    toolCall: SchemaToolCall;
    answer?: string;
}

const mapToolCallArgs = (toolCall: SchemaToolCall): Record<string, unknown> | undefined => {
    if (typeof toolCall.args === 'string') {
        return JSON.parse(toolCall.args) as Record<string, unknown>;
    } else {
        return toolCall.args ?? undefined;
    }
};

export const ToolCallWidget = ({ toolCall, answer }: ToolCallWidgetProps) => {
    const mappedArgs = mapToolCallArgs(toolCall);
    return (
        <CollapsibleWidgetBase>
            <CollapsibleWidgetHeading endAdornment={<ExpandArrow />}>
                {toolCall.toolName}
            </CollapsibleWidgetHeading>
            <CollapsibleWidgetPanel>
                <FadeOverflowContent className={css({ width: '[100%]' })}>
                    <CollapsibleWidgetPanelContent>
                        <ThemeSyntaxHighlighter customStyle={{ margin: 0, padding: 0 }}>
                            {JSON.stringify(mappedArgs, undefined, 2)}
                        </ThemeSyntaxHighlighter>
                    </CollapsibleWidgetPanelContent>
                    <CollapsibleWidgetFooter>Tool call</CollapsibleWidgetFooter>
                    <CollapsibleWidgetPanelContent>{answer}</CollapsibleWidgetPanelContent>
                </FadeOverflowContent>
            </CollapsibleWidgetPanel>
        </CollapsibleWidgetBase>
    );
};
