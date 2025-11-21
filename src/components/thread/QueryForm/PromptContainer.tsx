import { css } from '@allenai/varnish-panda-runtime/css';
import type { PropsWithChildren, ReactNode } from 'react';

const promptContainerClassName = css({
    width: '[100%]',
    display: 'flex',
    alignItems: 'end',
    columnGap: '1',
});

const startAdornmentClassName = css({
    display: 'flex',
    gap: '1',
});

const endAdornmentClassName = css({
    display: 'flex',
    gap: '1',
});

interface PromptContainerProps extends PropsWithChildren {
    startAdornment?: ReactNode;
    endAdornment?: ReactNode;
}

export const PromptContainer = ({
    startAdornment,
    endAdornment,
    children,
}: PromptContainerProps): ReactNode => {
    return (
        <div className={promptContainerClassName}>
            <div className={startAdornmentClassName}>{startAdornment}</div>
            {children}
            <div className={endAdornmentClassName}>{endAdornment}</div>
        </div>
    );
};
