import { css } from '@allenai/varnish-panda-runtime/css';
import { cx } from '@allenai/varnish-ui';
import type { PropsWithChildren, ReactNode } from 'react';

const contentContainer = css({
    display: 'flex',
    flexDirection: 'column',
    containerName: 'thread-page',
    containerType: 'inline-size',

    backgroundColor: 'transparent',
    height: '[100%]',
    paddingBlockEnd: '4',
    paddingBlockStart: '4',

    position: 'relative',
    overflow: 'hidden',

    lg: {
        gridArea: 'main-content',
        paddingBlockStart: '[48px]',
        // these are needed because grid automatically sets them to auto, which breaks the overflow behavior we want
        minHeight: '[0]',
        minWidth: '[0]',
    },
});

export const ContentContainer = ({
    className,
    children,
}: PropsWithChildren<{ className?: string }>): ReactNode => (
    <div className={cx(contentContainer, className)}>{children}</div>
);
