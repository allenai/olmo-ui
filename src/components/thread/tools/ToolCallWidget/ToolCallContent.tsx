import { ThemeSyntaxHighlighter } from '@/components/ThemeSyntaxHighlighter';
import { CollapsibleWidgetPanelContent } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetPanel';

interface ToolCallParametersProps {
    // Not using the optional ? here ensures that children are passed
    children: string | string[] | undefined;
}

export const ToolCallParameters = ({ children = '' }: ToolCallParametersProps) => {
    return (
        <CollapsibleWidgetPanelContent>
            <ThemeSyntaxHighlighter
                customStyle={{ margin: 0, padding: 0, backgroundColor: 'transparent' }}>
                {children}
            </ThemeSyntaxHighlighter>
        </CollapsibleWidgetPanelContent>
    );
};
