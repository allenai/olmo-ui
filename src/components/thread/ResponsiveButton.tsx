import { Button, ButtonProps } from '@mui/material';

import { DesktopLayoutBreakpoint } from '../../constants';

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
                sx={{
                    display: { xs: 'none', [DesktopLayoutBreakpoint]: 'inline-flex' },
                }}>
                {title}
            </Button>
            <Button
                {...props}
                aria-label={title}
                sx={{ display: { xs: 'inline-flex', [DesktopLayoutBreakpoint]: 'none' } }}>
                {startIcon}
            </Button>
        </>
    );
};
