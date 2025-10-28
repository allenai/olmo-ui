import { ThemeSyntaxHighlighter } from '@/components/ThemeSyntaxHighlighter';

export const ToolCallCodeBlock = ({ children = '' }: { children: string | undefined }) => {
    return (
        <ThemeSyntaxHighlighter
            customStyle={{
                margin: 0,
                padding: 0,
                wordBreak: 'break-word',
                backgroundColor: 'transparent',
            }}>
            {children}
        </ThemeSyntaxHighlighter>
    );
};
