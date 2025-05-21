import { css } from '@allenai/varnish-panda-runtime/css';
import { Outlet } from 'react-router-dom';

import { MetaTags } from '@/components/MetaTags';

const containerStyle = css({
    gridArea: 'content',
    paddingInline: '5',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'background',
    paddingBlockEnd: '2',
    minWidth: '[0]',
    minHeight: '[0]',
    gap: '2',
    overflow: 'auto',
});

export const ComparisonPage = () => {
    return (
        <>
            <MetaTags />
            <div className={containerStyle}>
                <Outlet />
            </div>
        </>
    );
};
