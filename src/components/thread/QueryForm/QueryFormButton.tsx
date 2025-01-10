import { IconButton, svgIconClasses } from '@mui/material';
import { ComponentProps, PropsWithChildren } from 'react';

interface QueryFormButtonProps
    extends PropsWithChildren,
        Pick<
            ComponentProps<typeof IconButton>,
            'type' | 'aria-label' | 'children' | 'disabled' | 'onKeyDown' | 'onClick'
        > {}

export const QueryFormButton = ({
    children,
    type,
    'aria-label': ariaLabel,
    disabled,
    onClick,
    onKeyDown,
}: QueryFormButtonProps) => {
    return (
        <IconButton
            size="medium"
            type={type}
            aria-label={ariaLabel}
            color="inherit"
            edge="end"
            disableRipple
            sx={(theme) => ({
                // paddingInlineEnd: 2,
                '&:hover': {
                    color: theme.color['teal-100'].hex,
                },
                [`&.Mui-focusVisible .${svgIconClasses.root}`]: {
                    outline: `1px solid`,
                    borderRadius: '50%',
                },
            })}
            disabled={disabled}
            onClick={onClick}
            onKeyDown={onKeyDown}>
            {children}
        </IconButton>
    );
};
