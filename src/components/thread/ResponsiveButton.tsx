import { Button, ButtonProps } from '@mui/material';

import { DesktopLayoutBreakpoint } from '../../constants';
import { mdAndUpContainerQuery } from '@/pages/UIRefreshThreadPage';

interface ResponsiveButtonProps extends Omit<ButtonProps, 'sx' | 'children'> {
    title: string;
}

export const ResponsiveButton = ({
    title,
    startIcon,
    ...props
}: ResponsiveButtonProps): JSX.Element => {
    return (
        <>
            <Button
                {...props}
                startIcon={startIcon}
                sx={(theme) => ({
                    display: 'none',
                    [mdAndUpContainerQuery(theme)]: {
                        display: 'inline-flex',
                    },
                })}>
                {title}
            </Button>
            <Button
                {...props}
                aria-label={title}
                sx={(theme) => ({
                    display: 'inline-flex',
                    [mdAndUpContainerQuery(theme)]: {
                        display: 'none',
                    },
                })}>
                {startIcon}
            </Button>
        </>
    );
};
