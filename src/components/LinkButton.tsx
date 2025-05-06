import { Button } from '@allenai/varnish-ui';
import { type ComponentProps, useCallback } from 'react';
import type { PressEvent } from 'react-aria-components';
import { type To, useNavigate } from 'react-router-dom';

interface LinkButtonProps extends ComponentProps<typeof Button> {
    to: To;
}

export const LinkButton = ({ to, onPress, ...rest }: LinkButtonProps) => {
    const navigate = useNavigate();

    const handlePress: ComponentProps<typeof Button>['onPress'] = useCallback(
        (e: PressEvent) => {
            navigate(to);
            onPress?.(e);
        },
        [navigate, onPress, to]
    );

    return <Button {...rest} onPress={handlePress} />;
};
