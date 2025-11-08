import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import temml from 'temml';

export interface MathBlockProps {
    inline?: boolean;
    children: string;
}

// light weight Markdown math to JSX + MathML component
// inspired by: https://github.com/Daiji256/rehype-mathml/blob/88130a9b7731f29833b62d841ca3f0ee53b7c57a/lib/index.ts
export const MathBlock = ({ inline = false, children }: MathBlockProps) => {
    const WrapperElement = inline ? 'span' : 'div';
    try {
        // this lib is based of katex and has better support, but outputs
        // MathML -- which is baseline supported now.
        const mathml = temml.renderToString(children, { displayMode: inline, throwOnError: true });

        // `fromHtmlIsomorphic` is light weight and uses the browser if possible
        const result = fromHtmlIsomorphic(mathml, { fragment: true });
        // hast util (powers react-markdown), that generates a JSX fragment
        // from a hast AST
        const jsxTree = toJsxRuntime(result, {
            Fragment,
            jsx,
            jsxs,
            // this defaults to false, it is set to `true` in the above `rehype-mathml` lib
            // this could maybe be removed.
            ignoreInvalidStyle: true,
        });
        return (
            <WrapperElement style={{ display: inline ? 'inline-block' : 'block' }}>
                {jsxTree}
            </WrapperElement>
        );
    } catch (e: unknown) {
        console.error(e);
        // should this render more error-y -- or just fallback to below
    }
    // this is the unparsed markdown text.
    return <WrapperElement>{children}</WrapperElement>;
};
