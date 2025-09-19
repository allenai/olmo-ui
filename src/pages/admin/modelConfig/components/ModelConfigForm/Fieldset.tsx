import { css } from '@allenai/varnish-panda-runtime/css';

export const Fieldset = ({ children }: { children: React.ReactNode }) => {
    return (
        <fieldset
            className={css({
                width: '[100%]',
                display: 'flex',
                flexDirection: 'column',
                gap: '3',
            })}>
            {children}
        </fieldset>
    );
};
