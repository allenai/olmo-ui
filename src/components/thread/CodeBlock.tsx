import { useEffect } from 'react';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeBlockProps {
    inline?: boolean;
    className?: string;
    children?: string;
}

const attributionHighlightRegex =
    /:attribution-highlight\[(?<spanText>.*)\]{variant=".*" span="(?<spanId>.*)"}/gm;

export const CodeBlock = ({ inline, className, children = '', ...props }: CodeBlockProps) => {
    const match = /language-(\w+)/.exec(className || '');

    const attributionHighlights = Array.from(children.matchAll(attributionHighlightRegex));
    console.log(attributionHighlights);

    const childrenWithoutAttributionHighlights = children.replaceAll(
        attributionHighlightRegex,
        '$1'
    );

    return !inline && match ? (
        <SyntaxHighlighter
            style={dracula}
            PreTag="div"
            language={match[1]}
            {...props}
            wrapLongLines>
            {childrenWithoutAttributionHighlights.replace(/\n$/, '')}
        </SyntaxHighlighter>
    ) : (
        <code className={className} {...props}>
            {children}
        </code>
    );
};
