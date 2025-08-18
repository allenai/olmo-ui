import { useTheme } from '@mui/material';
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
    const theme = useTheme();

    return (
        <SyntaxHighlighter
            style={atomDark}
            customStyle={{ background: theme.palette.background.code, ...customStyle }}
            PreTag="div"
            language={language}
            {...rest}
            wrapLongLines>
            {children}
        </SyntaxHighlighter>
    );
};
