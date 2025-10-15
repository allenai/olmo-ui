import { css } from '@allenai/varnish-panda-runtime/css';
import { PropsWithChildren } from 'react';

import { AppLayout } from '@/components/AppLayout';

const errorPageLayoutClassName = css({
    display: 'flex',
    gridArea: 'content',
    maxWidth: '[460px]',
    marginTop: '[32dvh]',
    marginInline: 'auto',
    flexDirection: 'column',
    textAlign: 'center',
    gap: '5',
    padding: '5',
    fontWeight: 'medium',
});

export const ErrorPageWrapper = ({ children }: PropsWithChildren) => {
    return (
        <AppLayout>
            <div className={errorPageLayoutClassName}>{children}</div>
        </AppLayout>
    );
};
