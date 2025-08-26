import { CodeBlock, type CodeBlockProps } from '@allenai/varnish-ui';

import { useColorMode } from './ColorModeProvider';

type ThemeSyntaxHighlighterProps = Omit<CodeBlockProps, 'value'> & {
    children: string;
};

export const ThemeSyntaxHighlighter = ({
    language = 'text',
    children,
    ...rest
}: ThemeSyntaxHighlighterProps) => {
    const { colorMode } = useColorMode();
    return (
        <CodeBlock language={language} {...rest} wrapLongLines colorMode={colorMode}>
            {children}
        </CodeBlock>
    );
};
