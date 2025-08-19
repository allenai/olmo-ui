import {
    PrismAsyncLight as SyntaxHighlighter,
    type SyntaxHighlighterProps,
} from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface ThemeSyntaxHighlighterProps extends SyntaxHighlighterProps {}

export const ThemeSyntaxHighlighter = ({
    language = 'text',
    children,
    customStyle,
    ...rest
}: ThemeSyntaxHighlighterProps) => {
    return (
        <SyntaxHighlighter
            style={atomDark}
            customStyle={customStyle}
            PreTag="div"
            language={language}
            {...rest}
            wrapLongLines>
            {children}
        </SyntaxHighlighter>
    );
};
