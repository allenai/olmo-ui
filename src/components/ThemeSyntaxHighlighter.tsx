import { CodeBlock, type CodeBlockProps } from '@allenai/varnish-ui';

import { useColorMode } from './ColorModeProvider';
import { MathBlock } from './markdownMath/MathBlock';

type ThemeSyntaxHighlighterProps = Omit<CodeBlockProps, 'value'> & {
    children: string;
};

export const ThemeSyntaxHighlighter = ({
    language,
    inline,
    children,
    ...rest
}: ThemeSyntaxHighlighterProps) => {
    const { colorMode } = useColorMode();
    if (language === 'math') {
        return <MathBlock inline={inline}>{children}</MathBlock>;
    }
    return (
        <CodeBlock
            PreTag={inline ? 'span' : 'div'}
            language={language}
            inline={inline}
            {...rest}
            wrapLongLines
            colorMode={colorMode}>
            {children}
        </CodeBlock>
    );
};
