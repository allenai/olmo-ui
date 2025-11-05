import type { DetailedHTMLProps, HTMLAttributes } from 'react';

declare module 'react/jsx-runtime' {
    namespace JSX {
        interface IntrinsicElements {
            math: DetailedHTMLProps<HTMLAttributes<MathMLElement>, MathMLElement>;
        }
    }
}
