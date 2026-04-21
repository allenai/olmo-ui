import type { IconProps } from '@allenai/varnish-ui';
import { Icon } from '@allenai/varnish-ui';

import ThinkingSvg from '@/components/assets/thinking.svg?react';

const ThinkingIcon = ({ color, size }: Omit<IconProps, 'children'>) => {
    return (
        <Icon color={color} size={size}>
            <ThinkingSvg />
        </Icon>
    );
};

export { ThinkingIcon };
