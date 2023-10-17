import React from 'react';
import { Button, Tooltip, ButtonProps } from '@mui/material';

interface Props extends ButtonProps {
    tooltip: string;
    children: JSX.Element;
}

// button used on floating toolbar in editor
export const ToolbarButton = ({ tooltip, children, ...buttonProps }: Props) => {
    return (
        <Button sx={{ minWidth: 0 }} {...buttonProps}>
            <Tooltip title={tooltip}>{children}</Tooltip>
        </Button>
    );
};
