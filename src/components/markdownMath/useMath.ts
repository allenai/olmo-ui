import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { ReactNode } from 'react';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import temml from 'temml';

type UseMathParams = {
    math: string;
    inline?: boolean;
};

export const useMath = ({ math, inline = false }: UseMathParams): ReactNode => {
    try {
        // this lib is based of katex and has better support, but outputs
        // MathML -- which is baseline supported now.
        const mathml = temml.renderToString(math, { displayMode: inline, throwOnError: true });
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
        return jsxTree;
    } catch (e: unknown) {
        // swallow parse errors, as they are likely caused streaming
        if (!(e instanceof temml.ParseError)) {
            console.error(e);
        }
    }
    return math;
};
