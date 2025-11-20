import { type CodeBlockProps } from '@allenai/varnish-ui';
import { PrismAsync as SyntaxHighlighter } from 'react-syntax-highlighter';

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
        <SyntaxHighlighter
            PreTag={inline ? 'span' : 'div'}
            language={language}
            inline={inline}
            {...rest}
            wrapLongLines
            colorMode={colorMode}>
            {children}
        </SyntaxHighlighter>
    );
};
