import { IconButton } from '@mui/material';
import { ComponentProps, PropsWithChildren } from 'react';

interface QueryFormButtonProps
    extends PropsWithChildren,
        Pick<
            ComponentProps<typeof IconButton>,
            'type' | 'aria-label' | 'children' | 'disabled' | 'onKeyDown' | 'onClick' | 'sx'
        > {}

export const QueryFormButton = ({
    children,
    type,
    'aria-label': ariaLabel,
    disabled,
    onClick,
    onKeyDown,
    sx,
}: QueryFormButtonProps) => {
    return (
        <IconButton
            size="medium"
            type={type}
            aria-label={ariaLabel}
            color="inherit"
            edge="end"
            disableRipple
            sx={[
                (theme) => ({
                    // override MUI style
                    padding: 0.5,
                    marginRight: 0,
                    '&:hover': {
                        color: theme.color['teal-100'].hex,
                    },
                    [`&.Mui-focusVisible`]: {
                        outline: `1px solid`,
                        borderRadius: '50%',
                    },
                }),
                // Array.isArray doesn't preserve Sx's array type
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
            disabled={disabled}
            onClick={onClick}
            onKeyDown={onKeyDown}>
            {children}
        </IconButton>
    );
};
