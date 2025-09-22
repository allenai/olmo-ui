import { css } from '@allenai/varnish-panda-runtime/css';

export const Fieldset = ({ children, legend }: { children: React.ReactNode; legend?: string }) => {
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
