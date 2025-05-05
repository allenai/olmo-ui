import { css } from '@allenai/varnish-panda-runtime/css';
import { Outlet } from 'react-router-dom';

const containerStyle = css({
    gridArea: 'content',
    paddingInline: '2',
    display: 'flex',
    flexDirection: 'column',
});

export const AdminLayout = () => {
    return (
        <div className={containerStyle}>
            <Outlet />
        </div>
    );
};
