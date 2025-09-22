import { css } from '@allenai/varnish-panda-runtime/css';
import type { ComponentType } from 'react';

const listItemStyle = css({
    marginInlineStart: '1',

    display: 'flex',
    alignItems: 'center',
    gap: '1',
});

const iconStyle = css({
    fontSize: '[1em!]',

    height: '[1rem!]',
    width: '[1rem!]',
});

export const ModelSelectFeatureIndicator = ({
    Icon,
    feature,
}: {
    Icon: ComponentType<{ className?: string }>;
    feature: string;
}) => {
    return (
        <li className={listItemStyle}>
            <Icon className={iconStyle} aria-hidden="true" />
            {feature}
        </li>
    );
};
