import { css } from '@allenai/varnish-panda-runtime/css';
import { Outlet } from 'react-router-dom';

import { MetaTags } from '@/components/MetaTags';

const containerStyle = css({
    gridArea: 'content',
    paddingInline: '2',
    display: 'flex',
    flexDirection: 'column',
});

export const AdminLayout = () => {
    return (
        <>
            <MetaTags />
            <div className={containerStyle}>
                <Outlet />
            </div>
        </>
    );
};
