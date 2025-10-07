import { css } from '@allenai/varnish-panda-runtime/css';
import { ReactNode } from 'react';

export const Fieldset = ({ children, legend }: { children: ReactNode; legend?: string }) => {
    return (
        <fieldset
            className={css({
                width: '[100%]',
                display: 'flex',
                flexDirection: 'column',
                gap: '3',
            })}>
            <legend>{legend}</legend>
            {children}
        </fieldset>
    );
};
