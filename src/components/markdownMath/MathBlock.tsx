import { HTMLAttributes } from 'react';

// allow us to style contaienr
export const MathBlock = (props: HTMLAttributes<MathMLElement>) => {
    return <math {...props} />;
};
