import { css } from '@allenai/varnish-panda-runtime/css';
import type { SvgIconComponent } from '@mui/icons-material';
import type { ComponentType } from 'react';

const listItemStyle = css({
    marginInlineStart: '1',

    display: 'flex',
    alignItems: 'center',
    gap: '1',
});

const iconStyle = css({
    fontSize: '[1em]',

    height: '[1em]',
    width: '[1em]',
});

export const ModelSelectFeatureIndicator = ({
    Icon,
    feature,
}: {
    Icon: ComponentType<{ className?: string }> | SvgIconComponent;
    feature: string;
}) => {
    return (
        <li className={listItemStyle}>
            <Icon
                className={iconStyle}
                classes={{ root: iconStyle }}
                fontSize="inherit"
                aria-hidden="true"
            />
            {feature}
        </li>
    );
};
