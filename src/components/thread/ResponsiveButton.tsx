import { Button, ButtonProps } from '@mui/material';

import { biggerContainerQuery } from '@/utils/container-query-utils';

type ResponsiveButtonProps = Omit<ButtonProps, 'sx' | 'children' | 'variant'> & {
    title: string;
} & (
        | { variant: ButtonProps['variant']; biggerVariant?: never; smallerVariant?: never }
        | {
              variant?: never;
              biggerVariant: ButtonProps['variant'];
              smallerVariant: ButtonProps['variant'];
          }
    );

export const ResponsiveButton = ({
    title,
    startIcon,
    variant,
    biggerVariant,
    smallerVariant,
    ...props
}: ResponsiveButtonProps): JSX.Element => {
    return (
        <>
            <Button
                {...props}
                variant={biggerVariant != null ? biggerVariant : variant}
                startIcon={startIcon}
                color="primary"
                sx={(theme) => ({
                    display: 'none',
                    [biggerContainerQuery(theme)]: {
                        display: 'inline-flex',
                    },
                    borderColor: theme.palette.primary.contrastText,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                        color: theme.palette.primary.contrastText,
                        borderColor: theme.palette.primary.contrastText,
                    },
                })}>
                {title}
            </Button>
            <Button
                {...props}
                variant={smallerVariant != null ? smallerVariant : variant}
                aria-label={title}
                sx={(theme) => ({
                    display: 'inline-flex',
                    [biggerContainerQuery(theme)]: {
                        display: 'none',
                    },
                    borderColor: theme.palette.primary.contrastText,
                    color: theme.palette.primary.contrastText,
                })}>
                {startIcon}
            </Button>
        </>
    );
};
