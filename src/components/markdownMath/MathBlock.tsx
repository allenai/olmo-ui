import { useMath } from './useMath';

export interface MathBlockProps {
    inline?: boolean;
    children: string;
}

// light weight Markdown math to JSX + MathML component
// inspired by: https://github.com/Daiji256/rehype-mathml/blob/88130a9b7731f29833b62d841ca3f0ee53b7c57a/lib/index.ts
export const MathBlock = ({ inline = false, children }: MathBlockProps) => {
    const WrapperElement = inline ? 'span' : 'div';

    const mathParsed = useMath({ math: children, inline })

    // this is the unparsed markdown text.
    return <WrapperElement>{mathParsed}</WrapperElement>;
};
