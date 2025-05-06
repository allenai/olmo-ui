import { css } from '@allenai/varnish-panda-runtime/css';
import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

const contentStyle = css({
    backgroundColor: 'background',
    paddingInline: '2',
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2',
    height: '[100%]',
});

export const ModelConfigurationLayout = (): ReactNode => {
    return (
        <div className={contentStyle}>
            <Outlet />
        </div>
    );
};
