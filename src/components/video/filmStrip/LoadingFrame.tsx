import { css } from '@allenai/varnish-panda-runtime/css';
import type { ReactNode } from 'react';

export const LoadingFrame = ({ aspectRatio = '16/9' }: { aspectRatio?: string }): ReactNode => {
    // TODO: room for improvement?
    return (
        <span
            className={css({
                height: '[100%]',
                width: '[100%]',
                backgroundColor: 'background.opacity-4.reversed',
            })}
            style={{ aspectRatio }}
        />
    );
};
