import { Icon, IconProps } from '@allenai/varnish-ui';

import ThinkingSvg from '@/components/assets/thinking.svg?react';

const ThinkingIcon = ({ color, size }: Omit<IconProps, 'children'>) => {
    return (
        <Icon color={color} size={size}>
            <ThinkingSvg />
        </Icon>
    );
};

export { ThinkingIcon };
