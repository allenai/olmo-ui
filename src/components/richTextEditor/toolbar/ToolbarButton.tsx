import React from 'react';
import styled from 'styled-components';
import { Button, Tooltip, ButtonProps } from '@mui/material';

interface Props extends ButtonProps {
    tooltip: string;
    children: JSX.Element;
}

// button used on floating toolbar in editor
export const ToolbarButton = ({ tooltip, children, ...buttonProps }: Props) => {
    return (
        <StyledButton sx={{ minWidth: 0 }} {...buttonProps}>
            <Tooltip title={tooltip}>{children}</Tooltip>
        </StyledButton>
    );
};

const StyledButton = styled(Button)`
    &&& {
        cursor: pointer;

        &.active {
            background-color: ${({ theme }) => theme.color2.N3};
        }

        &:hover {
            // match mui
            background-color: rgb(239, 240, 241);
        }
    }
`;
